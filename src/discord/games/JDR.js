const { createCanvas, loadImage } = require('canvas')

function JDR(botClient, channel, redis) {
    this.botClient = botClient;
    this.channel = channel;
    this.redis = redis;

    this.prefix = "*"
    this.diceParams = {
        6: { zero: false },
        4: { zero: false, imageParams: { fontSize: 60, x: 0, y: 0, textColor: '#FFF' }},
        8: { zero: false, imageParams: { fontSize: 50, x: -5, y: -4, textColor: '#FFF' }},
        10: { zero: true, imageParams: { fontSize: 50, x: 1, y: -6, textColor: '#FFF' }},
        12: { zero: false, imageParams: { fontSize: 50, x: -3, y: -8, textColor: '#FFF' }},
        20: { zero: false, imageParams: { fontSize: 40, x: -1, y: -6, textColor: '#FFF' }},
        100: { zero: false, imageParams: { fontSize: 80, x: -10, y: -6, textColor: '#FFF' }}
    }
}

JDR.prototype.isConcernedByMessage = function(message) {
    return true // message.channel.name.indexOf(this.channel) != -1
};

JDR.prototype.onMessage = function(message) {
    let actionTriggered = false;

    if (message.author.bot || !message.content.startsWith(this.prefix)) { return actionTriggered }
    this.prefix

    const args = message.content.slice(this.prefix.length).split(" ")
    const command = args.shift().toLowerCase()

    if (command == "pick") {
        actionTriggered = true;
        iDeck = parseInt(args[0], 10)
        if (isNaN(iDeck) || iDeck == undefined) iDeck = 1
        this.pickCard(message, iDeck)
    }

    if (command == "resetdeck") {
        actionTriggered = true;
        iDeck = parseInt(args[0], 10)
        if (isNaN(iDeck) || iDeck == undefined) iDeck = 1
        nbCards = parseInt(args[1], 10)
        this.resetDeck(message, iDeck, nbCards)
    }

    if (command == "roll") {
        actionTriggered = true;
        this.rollDice(message, args)
    }

    return actionTriggered;
};

JDR.prototype.rollDice = async function(message, args = ["100"]) {
    const dices = []
    for (let arg of args) {
        if (isNaN(parseInt(arg, 10))) {
            message.channel.send("???")
            return
        } else {
            if (arg == "100") {
                dices.push("100")
                dices.push("10")
            } else {
                dices.push(arg)
            }
        }
    }

    if (args.length == 0) {
        dices.push("100")   
        dices.push("10")   
    }
    
    for (let arg of dices) {
        let files = []
        let fields = []

        let dice = parseInt(arg, 10)
        if (arg == "100") {
            dice = 10
        }

        let result = randInt(1 - this.diceParams[dice].zero, dice - this.diceParams[dice].zero)
        if (arg == "100") {
            result = result + "0"
        }

        if (Object.keys(this.diceParams).includes(arg)) {
            var attachment 
            if (dice == 6) {     //load image
                attachment = `./src/discord/games/bddjdr/dice/${dice}/Dice${dice}-${result}.png`
            } else {            //generate image
                let canvasResponse = await editImage(`./src/discord/games/bddjdr/dice/Dice${dice}.png`, result, this.diceParams[dice].imageParams)//.then(canvasResponse =>
                attachment = canvasResponse.createPNGStream()
            }
        } else {
            let canvasResponse = await editImage(`./src/discord/games/bddjdr/dice/Dice100.png`, result, this.diceParams[100].imageParams)//.then(canvasResponse =>
            attachment = canvasResponse.createPNGStream()
        }
        files.push({
            attachment,
            name: 'result.jpg'
        })

        message.channel.send(
            { 
            embed: {
                color: 0x0000,
                title: `Vous lancez un dé ${arg} !`, //face${(dice > 1 ? "s" : "")} !`,
                image: { url: 'attachment://result.jpg' },
                fields
            },
            files
        })
        .catch(console.error);
    }
}

JDR.prototype.randomCard = function(cards) {
    return cards[randInt(0, cards.length - 1)]
}

JDR.prototype.generateDeck = function(nbCards) {
    card = []
    for (let suit of ["♠️", "♥️", "♦", "♣️"]) {
        for (let value of ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"]) {
            card.push(suit + value);
        }
    }
    card = this.shuffle(card)
    console.log("nbCards " + nbCards)
    console.log("card " + card)
    if (nbCards != undefined && !isNaN(nbCards)) {
        console.log("nbCards true")
        card = card.slice(0, nbCards)
    }
    console.log("card " + card)
    card.push("🃏")
    return card
}

JDR.prototype.pickCard = function(message, i = 1) {
    this.redis.lrange(`JDR/deck/${i}`, -100, 100, (err, cards) => {
        card = this.randomCard(cards)
        if (card == undefined) {
            message.channel.send("Le deck est vide !")
            return
        }
        this.redis.lrem(`JDR/deck/${i}`, 1, card)

        var file = card
        for (let suit of [["♠️", "Spade-"], ["♥️", "Heart-"], ["♦", "Diamond-"], ["♣️", "Club-"], ["🃏", "Joker"]]) {
            file = file.replace(suit[0], suit[1])
        }

        var color = 0x000000
        switch (file.substr(0,1)) {
            case "S": 
                color = 0x000000
                break
            case "H": 
                color = 0xFF0000
                break
            case "D": 
                color = 0xCD5C5C
                break
            case "C": 
                color = 0x808080
                break
            case "J": 
                color = 0x00FF00
                break
        }

        const files = [{
            attachment: `./src/discord/games/bddjdr/cards/${file}.jpg`,
            name: 'card.jpg'
        }]

        if (cards.length > 1) {
            files.push(
                {
                    attachment: `./src/discord/games/bddjdr/cards/back.jpg`,
                    name: 'back.jpg'
                },
            )
        }

        message.channel.send(
            { 
            embed: {
                color,
                title: "Votre carte",
                description: `Faites-en bon usage !`,
                image: { url: 'attachment://card.jpg' },
                thumbnail: { url: 'attachment://back.jpg' },
                fields: [{ 
                    name: `Carte${(cards.length > 2 ? "s" : "")} restante${(cards.length > 2 ? "s" : "")} : `,
                    value: cards.length - 1,
                    inline: false
                }]
            },
            files
        })
        .catch(console.error);
    })
}

JDR.prototype.resetDeck = function(message, i, nbCards) {
    console.log("message " + message + " i " + i + " nbCards " + nbCards)
    this.redis.del(`JDR/deck/${i}`, (err0, result0) => {
        this.redis.lpush(`JDR/deck/${i}`, this.generateDeck(nbCards), (err, result) => {
            message.channel.send("Le deck a été reset.")
        })
    })
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

JDR.prototype.shuffle = function(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

module.exports = JDR;
