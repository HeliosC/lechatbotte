const BDD = require('./bddmdp/BDDmdp.js');

listeMots = BDD.str;


function MotDePasse(botClient, channelId) {
    this.botClient = botClient;
    this.channelId = channelId;

    this.inGame = false;
    this.inGameSetup = false;

    this.currentPlayer = null;
    this.gameMessage = null;
    this.score = 0;
    this.currentWord = null;
    this.wordCount = 0;

    this.countdownTimeoutId = null;
    this.updateInterval = 5;
    this.timeRemaining = 0;
}

MotDePasse.prototype.isConcernedByMessage = function(message) {
    return message.channel.id == this.channelId
};

MotDePasse.prototype.onMessage = function(message) {
    let actionTriggered = false;

    if (this.inGameSetup || this.inGame) { return actionTriggered }
    if (message.author.bot) { return actionTriggered }


    if (message.content.toLowerCase() == "*mdp") {
        actionTriggered = true;

        this.currentPlayer = message.member.user;

        console.debug(`${this.currentPlayer.username} has started a game 'MotDePasse'`);
        
        const yesEmoji = this.botClient.emojis.cache.find(e => e.name == "yea")
        const noEmoji = this.botClient.emojis.cache.find(e => e.name == "nay")

        message.channel.send({
            embeds: [{
                color: 3447003,
                description: `${message.author}`  
                    + "\n" + `${yesEmoji}` + " pour commencer" 
                    + "\n" + `${noEmoji}` + " pour annuler "
            }]
        }).then(message => {
            this.gameMessage = message;
            this.inGameSetup = true;

            this.gameMessage.react(yesEmoji)
                .then(() => {
                    return this.gameMessage.react(noEmoji)
                }).then(() => {/* The 2 reactions has been send */})
                .catch(console.error);

        }).catch(console.error);
    }

    return actionTriggered;
};

MotDePasse.prototype.isConcernedByReaction = function(reaction) {
    return reaction.message.channel.id == this.channelId;
};

MotDePasse.prototype.onReaction = function(reaction, user) {
    let actionTriggered = false;

    if (user.bot) { return actionTriggered }
    if (reaction.message.channel.id != this.channelId) { return actionTriggered }

    // remove every reaction added by any user
    reaction.users.remove(user.id);
    actionTriggered = true;

    // ignore any reaction of any other users
    if (this.currentPlayer != user) { return actionTriggered }

    if (this.inGameSetup) {
        if (reaction.emoji.name == "yea") {
            this.startGame();
        } else if (reaction.emoji.name == "nay") {
            this.inGameSetup = false;
            this.gameMessage.channel.send("Annulé !");
        }
    } else if (this.inGame) {
        if (reaction.emoji.name == "yea") {
            this.currentWord = this.getRandomWord();
            this.score++;
            this.wordCount++;
            this.updateGameMessage();
        } else if (reaction.emoji.name == "nay") {
            this.currentWord = this.getRandomWord();
            this.wordCount++;
            this.updateGameMessage();
        }
    }

    return actionTriggered;
};

MotDePasse.prototype.getRandomWord = function() {
    return listeMots[randInt(0, BDD.str.length - 1)];
};

MotDePasse.prototype.startGame = function() {
    this.currentWord = this.getRandomWord();
    this.score = 0;
    this.timeRemaining = 90; // seconds
    this.inGameSetup = false;
    this.inGame = true;

    this.updateGameMessage();
    this.countdown();
    setTimeout(() => {
        this.inGame = false;
        this.gameMessage.channel.send("TIME'S UP !");
    }, this.timeRemaining * 1000);
};

MotDePasse.prototype.updateGameMessage = function() {
    let minutes = Math.trunc(this.timeRemaining / 60);
    let seconds = this.timeRemaining % 60;

    this.gameMessage.edit({
        embeds: [{
            color: 3447003,
            description: `${this.currentPlayer}\n`
                + `Temps : ${minutes}' ${seconds}''\n`
                + `Score : ${this.score}\n\nMot : ${this.currentWord}`
        }]
    });
};

MotDePasse.prototype.countdown = function() {
    this.countdownTimeoutId = setTimeout(() => {
        if (this.timeRemaining > 0) {
            this.timeRemaining -= this.updateInterval;
            this.updateGameMessage();
            this.countdown();
        } else {
            this.countdownTimeoutId = null;
        }
    }, this.updateInterval * 1000);
};



function randInt(min = 1, max = 25) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


module.exports = MotDePasse;
