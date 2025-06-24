const { SlashCommandBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');

//Todo: import this dynamically
const food = require('../../games/bddquiz/food.js').str;
const terre = require('../../games/bddquiz/terre.js').str;
const chat = require('../../games/bddquiz/chat.js').str;
const q2017 = require('../../games/bddquiz/2017.js').str;
const genre = require('../../games/bddquiz/genre.js').str;
const quebec = require('../../games/bddquiz/quebec.js').str;
const motrigolo = require('../../games/bddquiz/motrigolo.js').str;
const solaire = require('../../games/bddquiz/solaire.js').str;
const mars = require('../../games/bddquiz/mars.js').str;
const jo = require('../../games/bddquiz/jo.js').str;

const themes =    ["Food", "Terre", "Chat", "2017", "Genre de mot", "Quebec", "Mot rigolo", "Système Solaire", "Mars", "JO"];
const questions = [ food,   terre,   chat,   q2017,  genre,   quebec,   motrigolo,   solaire,   mars,   jo ];
const nbQuestionsForTheme = [ 100,    50,      50,     26,     50,      42,       26,          36,        26,     50 ];

module.exports = {
	data: new SlashCommandBuilder()
		.setName('quipoquiz')
		.setDescription('On en apprend tous les jours grâce à quipo quiz !')
        .addStringOption(option =>
            option
                .setName('theme')
                .setDescription('Choississez un thème si vous le souhaitez')
                .setRequired(false)
                .addChoices(themes.map(theme => { return { name: theme, value: theme } }))
        ),
    getChannel: serverConfig => serverConfig?.channels?.quiz,

	async execute(interaction) {
		const answerTrueButton = new ButtonBuilder()
			.setCustomId('true')
			.setLabel('Vrai')
			.setStyle(ButtonStyle.Success);

		const answerFalseButton = new ButtonBuilder()
			.setCustomId('false')
			.setLabel('Faux')
			.setStyle(ButtonStyle.Danger);

        const answerButtonRaw = new ActionRowBuilder().addComponents(answerTrueButton, answerFalseButton)
        const theme = interaction.options.getString('theme')
        const [questionMessage, responseMessage] = getNewQuestionMessages(theme)

        const response = await interaction.reply({
            embeds: [buildGameEmbed(questionMessage)],
            components: [answerButtonRaw],
            withResponse: true
        });

        const confirmationCollectorFilter = i => i.user.id === interaction.user.id

        try {
            const confirmation = await response.resource.message.awaitMessageComponent({
                filter: confirmationCollectorFilter,
                time: 5 * 60_000
            })
            
            const positiveAnswer = responseMessage[15] == "V";

            if ((positiveAnswer && confirmation.customId === 'true')
                || (!positiveAnswer && confirmation.customId === 'false')) {
                await confirmation.update({
                    embeds: [buildGameEmbed(`${questionMessage}\n\n✅ Bonne réponse !\n||${responseMessage}||`)],
                    components: []
                })
            } else if ((positiveAnswer && confirmation.customId === 'false')
                || (!positiveAnswer && confirmation.customId === 'true')) {
                    await confirmation.update({
                        embeds: [buildGameEmbed(`${questionMessage}\n\n❌ Mauvaise réponse\n||${responseMessage}||`)],
                        components: []
                    })
            }
        } catch {
            await interaction.editReply({
                content: "Question annulée",
                components: []
            })
        }
	},
};


function buildGameEmbed(message) {
    return {
        color: 3447003,
        description: message
    }
}

function getNewQuestionMessages(theme) {
    theme = theme ?? themes[randInt(0, themes.length - 1)]

    const themeIndex = themes.indexOf(theme)
    let [question, response] = getQuestion(themeIndex, randInt(1, nbQuestionsForTheme[themeIndex]));

    return [`[Thème : ${theme}]\n${question}`, response]
};

function randInt(min = 1, max = 25) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getQuestion(themeIndex, randomNumber) {

    let themeDB = questions[themeIndex];

    let questionSymbol = "(" + randomNumber + ")";
    let nextQuestionSymbol = "(" + (randomNumber + 1) + ")";
    let responseSymbol = "(R)";
    let questionSymbolSize = randomNumber.toString().length + 2;
    let nextQuestionSymbolSize = (randomNumber + 1).toString().length + 2;


    let index = 0;
    while (themeDB.substr(index, questionSymbolSize) != questionSymbol) {
        index++;
    }
    let indexSymbolQuestion = index;
    while (themeDB.substr(index, 3) != responseSymbol) {
        index++;
    }
    let indexSymbolResponse = index;

    let question = themeDB.substr(
        indexSymbolQuestion + 3 + questionSymbolSize,
        indexSymbolResponse - indexSymbolQuestion - 3 - questionSymbolSize
    );

    while (themeDB.substr(index, nextQuestionSymbolSize) != nextQuestionSymbol) {
        index++;
    }
    let indexSymbolNextQuestion = index;

    let response = themeDB.substr(
        indexSymbolResponse + 3,
        indexSymbolNextQuestion - indexSymbolResponse - 3
    );


    return [question, response];
}