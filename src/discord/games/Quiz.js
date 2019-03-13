const food = require('./bddquiz/food.js').str;
const terre = require('./bddquiz/terre.js').str;
const chat = require('./bddquiz/chat.js').str;
const q2017 = require('./bddquiz/2017.js').str;
const genre = require('./bddquiz/genre.js').str;
const quebec = require('./bddquiz/quebec.js').str;
const motrigolo = require('./bddquiz/motrigolo.js').str;
const solaire = require('./bddquiz/solaire.js').str;
const mars = require('./bddquiz/mars.js').str;
const jo = require('./bddquiz/jo.js').str;

const themes =    ["food", "terre", "chat", "2017", "genre", "quebec", "motrigolo", "solaire", "mars", "jo"];
const questions = [ food,   terre,   chat,   q2017,  genre,   quebec,   motrigolo,   solaire,   mars,   jo ];
const nbQuestionsForTheme = [ 100,    50,      50,     26,     50,      42,       26,          36,        26,     50 ];



function Quiz(botClient, channel) {
    this.botClient = botClient;
    this.channel = channel;

    this.runningGameMessage = {};
}

Quiz.prototype.isConcernedByMessage = function(message) {
    return message.channel.name.indexOf(this.channel) != -1;
};

Quiz.prototype.onMessage = function(message) {
    let actionTriggered = false;

    let lowerContent = message.content.toLowerCase();
    let [commandName, ...args] = lowerContent.split(" ");

    if (commandName == "*qq" || commandName == "*quipoquiz") {
        actionTriggered = true;

        if (args.length >= 1 && (args[0] == "themes" || args[0] == "?")) {
            this.displayThemes(message.channel);
        } else {
            let themeIndex = null;
            if (args.length >= 1) {
                let themeName = args[0];
                let index = themes.indexOf(themeName);
                if (index != -1) {
                    themeIndex = index;
                }
            }

            if (themeIndex === null) {
                themeIndex = randInt(0, themes.length - 1);
            }

            this.createNewQuestionMessage(message.channel, message.author, themeIndex);
        }
    }

    return actionTriggered;
};

Quiz.prototype.onReaction = function(reaction, user) {
    let actionTriggered = false;

    let message = reaction.message;

    if (!(message.id in this.runningGameMessage)) {
        return actionTriggered;
    }

    let {themeName, question, reponse, userId, timeoutId} = this.runningGameMessage[message.id];

    if (user.id != userId) {
        return actionTriggered;
    }


    let positiveAnswer = response[15] == "V";

    let statusMessage = null;

    if (reaction.emoji.name == "yea") {
        if (positiveAnswer) {
            statusMessage = "GAGNE";
        } else {
            statusMessage = "PERDU";
        }
    } else if (reaction.emoji.name == "nay") {
        if (positiveAnswer) {
            statusMessage = "PERDU";
        } else {
            statusMessage = "GAGNE";
        }
    }

    if (statusMessage === null) {
        return actionTriggered;
    }

    message.edit({ embed: {
        color: 3447003,
        description: `${user} [Thème : ${themeName}]\n${question}\n\n${statusMessage}\n${response}`
    }});

    this.terminateGameMessage(message.id);

    actionTriggered = true;

    return actionTriggered;
};


Quiz.prototype.displayThemes = function(channel) {
    var description = "Liste des themes :\n";
    for (let themeName of themes) {
        description =  `${description} - ${themeName}\n`;
    }
    channel.send({ embed: { color: 3447003, description: description } });
};

Quiz.prototype.createNewQuestionMessage = function(channel, user, themeIndex) {
    let [question, reponse] = getQuestion(themeIndex, randInt(1, nbQuestionsForTheme[themeIndex]));
    let themeName = themes[themeIndex];

    channel.send({ embed: {
        color: 3447003,
        description: `${user} [Thème : ${themeName}]\n${question}`
    }}).then(message => {
        const timeoutId = setTimeout(() => {
            delete this.runningGameMessage[message.id];
            message.delete();
        }, 60 * 60 * 1000); // autodelete after 1h

        this.runningGameMessage[message.id] = {
            themeName: themeName,
            question: question,
            response: response,
            userId: user.id,
            timeoutId: timeoutId
        };

        var yesEmoji = this.botClient.emojis.find(e => e.name == "yea");
        var noEmoji = this.botClient.emojis.find(e => e.name == "nay");
        message.react(yesEmoji)
            .then(_ => {
                return message.react(noEmoji);
            }).catch(console.error);
    }).catch(console.error);
};

Quiz.prototype.terminateGameMessage = function(messageId) {
    if (messageId in this.runningGameMessage) {
        clearTimeout(this.runningGameMessage[messageId].timeoutId);
        delete this.runningGameMessage[messageId];
    }
};

module.exports = Quiz;


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

    response = themeDB.substr(
        indexSymbolResponse + 3,
        indexSymbolNextQuestion - indexSymbolResponse - 3
    );


    return [question, response];
}
