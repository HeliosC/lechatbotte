const { SlashCommandBuilder } = require('discord.js')
const { createCanvas, loadImage } = require('canvas')

const diceParams = {
    6: { zero: false },
    4: { zero: false, imageParams: { fontSize: 60, x: 0, y: 0, textColor: '#FFF' }},
    8: { zero: false, imageParams: { fontSize: 50, x: -5, y: -4, textColor: '#FFF' }},
    10: { zero: true, imageParams: { fontSize: 50, x: 1, y: -6, textColor: '#FFF' }},
    12: { zero: false, imageParams: { fontSize: 50, x: -3, y: -8, textColor: '#FFF' }},
    20: { zero: false, imageParams: { fontSize: 40, x: -1, y: -6, textColor: '#FFF' }},
    100: { zero: true, imageParams: { fontSize: 50, x: 1, y: -6, textColor: '#FFF' }} //also used for custom dice
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('roll')
		.setDescription('Tire un dé !')

        .addSubcommand(subcommand =>
			subcommand
                .setName('dice')
                .setDescription('Tirez un dé')
                .addIntegerOption(option =>
                    option
                        .setName('dé')
                        .setDescription('Choississez votre dé')
                        .addChoices(Object.keys(diceParams).map(dice => { return { name: dice, value: parseInt(dice) } }))
                )
        )

        .addSubcommand(subcommand =>
			subcommand
                .setName('custom-dice')
                .setDescription('Tirez un dé en choisissant le nombre de faces')
                .addIntegerOption(option => 
                    option
                        .setName('faces')
                        .setDescription('Nombre de faces du dé')
                        .setMinValue(0)
                        .setMaxValue(100)            
            )
        ),

    //getChannel: serverConfig => serverConfig?.channels?.jdr,

	async execute(interaction) {
        const dice = (
            interaction.options.getSubcommand() === 'dice' ?
            interaction.options.getInteger('dé') 
            : interaction.options.getInteger('faces')
        ) ?? 100

        let messageMaxResult = ''
        if (Object.keys(diceParams).includes(String(dice))) {
            let result = randInt(1 - diceParams[dice].zero, dice - diceParams[dice].zero)
            var attachment 
            if (dice == 6) {     //load image
                attachment = `./src/discord/games/bddjdr/dice/${dice}/Dice${dice}-${result}.png`
            } else {            //generate image
                let canvasResponse = await editImage(`./src/discord/games/bddjdr/dice/Dice${dice}.png`, result, diceParams[dice].imageParams)
                attachment = canvasResponse.createPNGStream()
            }

            if(diceParams[dice].zero) {
                messageMaxResult = ` (max : ${dice - 1})`
            }
        } else {
            let result = randInt(1, dice)
            let canvasResponse = await editImage(`./src/discord/games/bddjdr/dice/Dice100.png`, result, diceParams[100].imageParams)
            attachment = canvasResponse.createPNGStream()
        }

        interaction.reply({ 
            embeds: [{
                color: 0x0000,
                title: `Vous lancez un dé ${dice} !${messageMaxResult}`,
                image: { url: 'attachment://result.jpg' },
            }],
            files: [{
                attachment,
                name: 'result.jpg'
            }]
        })
        .catch(error => {
            console.error(error)
            interaction.reply({
                content: 'There was an error while executing this command!',
                flags: MessageFlags.Ephemeral
            });
        });
    
    }
}

function randInt(min = 0, max = 9) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function editImage(img, number, {fontSize, x, y, textColor} = {fontSize: 50, x: 0, y: 0, textColor: '#FFF'}) {
	img = await loadImage(img); // Load the image first to get its dimensions
	const canvas = createCanvas(img.width, img.height);
	const ctx = canvas.getContext('2d');

	ctx.drawImage(img, 0, 0); // Draw the image onto the canvas

	// Writing text
	ctx.font = `${fontSize}px Roboto`;
	ctx.fillStyle = textColor;
	ctx.strokeStyle = '#000';
	ctx.lineWidth = 0;
	const text = `${number}`;
	const textDimen = ctx.measureText(text);
	ctx.fillText(text, img.width / 2 - textDimen.width / 2 + x, img.height / 2 + textDimen.emHeightAscent / 2 + y);

	return canvas;
}