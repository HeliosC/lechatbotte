
function Connect4(botClient, channel, rolesName) {
    this.botClient = botClient;
    this.channel = channel;
    this.rolesName = rolesName;

    this.inCreationGameMessages = {};
    this.runningGamesMessages = {};
}

Connect4.prototype.isConcernedByMessage = function(message) {
    return message.channel.name.indexOf(this.channel) != -1 && !message.author.bot;
};

Connect4.prototype.onMessage = function(message) {
    let actionTriggered = false;

    if (message.content.toLowerCase().startsWith("*c4")) {
        var players = Array.from(message.mentions.users.values())
        if (players.length == 0) {
            message.delete();
            return
        }
        let user1 = message.author;
        let user2 = players[0];
        message.channel.send(players[0] + ", une game contre " + message.author + "?")
            .then(message => {
                var yesEmoji = this.botClient.emojis.find(e => e.name == "yea");
                var noEmoji = this.botClient.emojis.find(e => e.name == "nay");

                this.inCreationGameMessages[message.id] = {
                    user1: user1,
                    user2: user2
                };

                message.react(yesEmoji)
                    .then(() => {
                        message.react(noEmoji);
                    })

                setTimeout(() => {
                    if (message.id in this.inCreationGameMessages) {
                        delete this.inCreationGameMessages[message];
                        message.delete();
                    }
                }, 5 * 60 * 1000); // After 5 min we remove the message if the game didn't start

            }).catch(console.error);
    }

    return actionTriggered;
};

Connect4.prototype.isConcernedByReaction = function(reaction) {
    return reaction.message.channel.name.indexOf(this.channel) != -1;
};

Connect4.prototype.onReaction = function(reaction, user) {
    let actionTriggered = false;

    if (user.bot) { return actionTriggered }

    // Game confirmation
    if (reaction.message.id in this.inCreationGameMessages) {
        let {user1, user2} = this.inCreationGameMessages[reaction.message.id];

        actionTriggered = true;

        if (user != user2) {
            reaction.remove(user);
            return actionTriggered;
        }

        delete this.inCreationGameMessages[reaction.message.id];

        if (reaction.emoji.name == "yea") {
            var game = new Connect4DiscordGame(reaction.message.channel, user1, user2, (interactiveMessage) => {
                this.runningGamesMessages[interactiveMessage.id] = game;

                // Automatically deleted after an hour
                setTimeout(() => {
                    if (interactiveMessage.id in this.runningGamesMessages) {
                        delete this.runningGamesMessages[interactiveMessage.id];
                        interactiveMessage.delete();
                    }
                }, 60 * 60 * 1000);
            });
        } else if (reaction.emoji.name == "nay") {
            // game already deleted -> we delete the message
            reaction.message.delete();
        }
    }

    // Game reaction
    if (reaction.message.id in this.runningGamesMessages) {
        actionTriggered = true;

        let game = this.runningGamesMessages[reaction.message.id];

        game.userReacted(reaction, user);

        if (game.isEnded()) {
            delete this.runningGamesMessages[reaction.message.id];
        }
    }

    return actionTriggered;
};

module.exports = Connect4;


const bleu = "🔵";
const rouge = "🔴";
const blanc = "⚪️";
const separator = "----";
const reactionEmoji = ["🇦", "🇧", "🇨", "🇩", "🇪", "🇫", "🇬"];


function Connect4DiscordGame(channel, user1, user2, onControlMessageCreated) {
    this.connect4Game = new Connect4Game(/*width: */7, /*height: */6, /*toAlign: */4);

    this.channel = channel;
    this.users = [user1, user2];

    this.controlsMessage = null;
    this.boardMessage = null;

    this.createControlsMessage()
        .then(() => {
            return Promise.all([
                this.createBoardMessage(),
                this.addReactionToControlsMessage()
            ])
        }).then(() => {
            onControlMessageCreated(this.controlsMessage);
            return this.updateBoardMessage()
        })
        .catch(console.error);
}

Connect4DiscordGame.prototype.createControlsMessage = function() {
    return this.channel
        .send({ embed: { description: `${separator}⬇️`.repeat(7).slice(separator.length) } })
        .then(message => {
            this.controlsMessage = message;
        })
        .catch(console.error);
};

Connect4DiscordGame.prototype.addReactionToControlsMessage = function() {
    return this.controlsMessage.react(reactionEmoji[0])
        .then(() => this.controlsMessage.react(reactionEmoji[1]))
        .then(() => this.controlsMessage.react(reactionEmoji[2]))
        .then(() => this.controlsMessage.react(reactionEmoji[3]))
        .then(() => this.controlsMessage.react(reactionEmoji[4]))
        .then(() => this.controlsMessage.react(reactionEmoji[5]))
        .then(() => this.controlsMessage.react(reactionEmoji[6]))
        .catch(console.error);
};

Connect4DiscordGame.prototype.createBoardMessage = function() {
    return this.channel.send({ embed: {
        color: 3447003,
        description: this.getGameStringRepresentation()
    }}).then(message => {
        this.boardMessage = message;
    }).catch(console.error)
};

Connect4DiscordGame.prototype.userReacted = function(reaction, user) {
    reaction.remove(user);

    if (user == [null, ...this.users][this.connect4Game.currentPlayer]) {
        let column = reactionEmoji.indexOf(reaction.emoji.toString());

        this.connect4Game.play(column);
        this.updateBoardMessage();
    }
};

Connect4DiscordGame.prototype.isEnded = function() {
    return this.connect4Game.winner !== null || this.connect4Game.boardIsFull();
};

Connect4DiscordGame.prototype.updateBoardMessage = function() {
    let currentGameStatus = "";

    let currentPlayerColor = [blanc, bleu, rouge][this.connect4Game.currentPlayer];
    let currentPlayer = [null, ...this.users][this.connect4Game.currentPlayer];

    if (this.connect4Game.winner !== null) {
        currentPlayerColor = [blanc, bleu, rouge][this.connect4Game.winner];
        currentPlayer = [null, ...this.users][this.connect4Game.winner];
        currentGameStatus = `${currentPlayerColor} ${currentPlayer} a gagné !`
    } else if (this.connect4Game.boardIsFull()) {
        currentGameStatus = "Match nul";
    } else {
        currentGameStatus = `\nTour de ${currentPlayerColor}: ${currentPlayer}`;
    }

    this.boardMessage.edit({ embed: {
            color: 3447003,
            description: this.getGameStringRepresentation()
                + "\n" + currentGameStatus
        }
    });
};


Connect4DiscordGame.prototype.getGameStringRepresentation = function() {
    let stringLines = []

    function playerToSymbol(value) {
        return [blanc, bleu, rouge][value];
    }

    for (let line of this.connect4Game.board) {
        stringLines.push(
            line.map(playerToSymbol).join(separator)
        );
    }

    return stringLines.reverse().join("\n\n") + "\n\n";
}




function Connect4Game(width, height, toAlign) {
    this.boardWidth = width;
    this.boardHeight = height;

    this.board = null;
    this.toAlign = toAlign;
    this.resetBoard();
    this.currentPlayer = 1;

    this.winner = null;
}

Connect4Game.EMPTY = 0;
Connect4Game.PLAYER_1 = 1;
Connect4Game.PLAYER_2 = 2;

Connect4Game.prototype.resetBoard = function() {
    let board = [];

    for (let i = 0; i < this.boardHeight; i++) {
        let line = [];
        for (let j = 0; j < this.boardWidth; j++) {
            line.push(Connect4Game.EMPTY);
        }
        board.push(line);
    }

    this.board = board;
};

Connect4Game.prototype.checkWinFromPoint = function(line, column) {

    if (line < 0 || line >= this.boardHeight) { return; }
    if (column < 0 || column >= this.boardWidth) { return; }

    let playerCell = this.board[line][column];

    if (playerCell == Connect4Game.EMPTY) { return; }

    // Horizontal, Vertical, Diagonal1, Diagonal2
    let vectors = [[0, 1], [1, 0], [1, 1], [1, -1]];
    let counts = [1, 1, 1, 1]

    for (let index in vectors) {
        let [dirLine, dirColumn] = vectors[index];

        for (let factor of [1, -1]) {
            let nextLine = line + dirLine * factor;
            let nextColumn = column + dirColumn * factor;

            while (
                nextLine >= 0 && nextLine < this.boardHeight
                && nextColumn >= 0 && nextColumn < this.boardWidth
                && this.board[nextLine][nextColumn] == playerCell
            ) {
                nextLine += dirLine * factor;
                nextColumn += dirColumn * factor;
                counts[index] += 1;
            }
        }
    }

    for (let count of counts) {
        if (count >= this.toAlign) {
            this.winner = playerCell;
            this.currentPlayer = 0;
        }
    }

    return this.winner;
};

Connect4Game.prototype.boardIsFull = function() {
    return this.board[this.boardHeight - 1].filter(x => x == Connect4Game.EMPTY).length == 0
};

Connect4Game.prototype.play = function(column) {
    if (column < 0 || column >= this.boardWidth) { return; }

    let line = 0;
    while (line < this.boardHeight && this.board[line][column] != Connect4Game.EMPTY) {
        line += 1;
    }

    if (line == this.boardHeight) { return; }

    this.board[line][column] = this.currentPlayer;
    this.currentPlayer = this.currentPlayer == Connect4Game.PLAYER_1 ? Connect4Game.PLAYER_2 : Connect4Game.PLAYER_1;

    this.checkWinFromPoint(line, column);
};
