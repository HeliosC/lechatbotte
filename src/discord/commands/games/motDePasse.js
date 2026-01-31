const { SlashCommandBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, MessageFlags, ComponentType } = require('discord.js');
const BDD = require('../../games/bddmdp/BDDmdp.js');

listeMots = BDD.str;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('motdepasse')
		.setDescription('Fais deviner le plus de mots pendant le temps imparti !'),
    getChannel: serverConfig => serverConfig?.channels?.games,
	async execute(interaction) {
        const adversaire = interaction.options.getUser('adversaire');

		const startButton = new ButtonBuilder()
			.setCustomId('start')
			.setLabel('Démarrer')
			.setStyle(ButtonStyle.Success);

		const cancelButton = new ButtonBuilder()
			.setCustomId('cancel')
			.setLabel('Annuler')
			.setStyle(ButtonStyle.Danger);

        const confirmationButtonRaw = new ActionRowBuilder().addComponents(startButton, cancelButton)

        const response = await interaction.reply({
            content: `Prêt ?`,
            components: [confirmationButtonRaw],
            withResponse: true,
            flags: MessageFlags.Ephemeral
        });

        try {
            const gameMessage = await response.resource.message.awaitMessageComponent({
                time: 5 * 60_000
            })

            if (gameMessage.customId === 'start') {                
                const correctButton = new ButtonBuilder()
                    .setCustomId('correct')
                    .setLabel('Correct')
                    .setEmoji('✅')
                    .setStyle(ButtonStyle.Success);
    
                const skipButton = new ButtonBuilder()
                    .setCustomId('skip')
                    .setLabel('Passer')
                    .setEmoji('❌')
                    .setStyle(ButtonStyle.Danger);
        
                const gameButtonRaw = new ActionRowBuilder().addComponents(correctButton, skipButton)
                const gameConfirmed = await gameMessage.update({ 
                    components: [gameButtonRaw],
                    withResponse: true
                })                

                const game = new MotDePasse()
                game.startGame(gameMessage)

                const gameMesage = gameConfirmed.resource.message
                const buttonCollector = gameMesage.createMessageComponentCollector({
                    componentType: ComponentType.Button,
                    time: MotDePasse.totalTime * 1000
                })

                buttonCollector.on('collect', async i => {
                    //console.log(i.customId);

                    if (i.customId === "correct") {
                        game.currentWord = game.getRandomWord();
                        game.score++;
                        game.wordCount++;
                        //game.updateGameMessage(gameMessage);
                        i.update(game.getGameMessage())
                    } else if (i.customId === "skip") {
                        game.currentWord = game.getRandomWord();
                        game.wordCount++;
                        //game.updateGameMessage(gameMessage);
                        i.update(game.getGameMessage())
                    }
                })
            } else if (gameMessage.customId === 'cancel') {
                await gameMessage.update({
                    content: "Partie annulée",
                    components: []
                })
            }
        } catch(error) {
            console.error(error)
            await interaction.editReply({
                content: "Partie annulée",
                components: []
            })
        }
	},
};

class MotDePasse {
    static totalTime = 90

    constructor() {
        this.inGame = false;

        this.score = 0;
        this.currentWord = null;
        this.wordCount = 0;

        this.countdownTimeoutId = null;
        this.updateInterval = 5;
        this.timeRemaining = 0;
    }

    startGame(gameMesage) {
        this.currentWord = this.getRandomWord();
        this.score = 0;
        this.timeRemaining = MotDePasse.totalTime; // seconds
        this.inGameSetup = false;
        this.inGame = true;
    
        this.updateGameMessage(gameMesage);
        this.countdown(gameMesage);
        setTimeout(() => {
            this.inGame = false;
            gameMesage.editReply({ content: "TIME'S UP !", components: [] });
        }, this.timeRemaining * 1000);
    }

    getGameMessage() {
        let minutes = Math.trunc(this.timeRemaining / 60);
        let seconds = Math.max(this.timeRemaining % 60, 0);

        return {
            embeds: [{
                color: 3447003,
                description: `Temps : ${minutes}' ${seconds}''\n`
                    + `Score : ${this.score}\n\nMot : ${this.currentWord}`
            }]
        }
    }

    updateGameMessage(gameMesage) {    
        gameMesage.editReply(this.getGameMessage());
    };
    
    countdown(gameMesage) {
        this.countdownTimeoutId = setTimeout(() => {
            if (this.timeRemaining > 0) {
                this.timeRemaining -= this.updateInterval;
                this.updateGameMessage(gameMesage);
                this.countdown(gameMesage);
            } else {
                this.countdownTimeoutId = null;
            }
        }, this.updateInterval * 1000);
    }

    getRandomWord() {
        return listeMots[randInt(0, BDD.str.length - 1)];
    }
}

function randInt(min = 1, max = 25) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}