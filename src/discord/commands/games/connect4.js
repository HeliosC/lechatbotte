const { SlashCommandBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('puissance4')
		.setDescription('Défi un joueur au puissance 4 !')
        .addUserOption(option =>
            option
                .setName('adversaire')
                .setDescription('Le joueur que vous souhaitez défier')
                .setRequired(true)
        ),
    getChannel: serverConfig => serverConfig?.channels?.games,
	async execute(interaction) {
        const adversaire = interaction.options.getUser('adversaire');

		const acceptButton = new ButtonBuilder()
			.setCustomId('accept')
			.setLabel('Accepter')
			.setStyle(ButtonStyle.Success);

		const denyButton = new ButtonBuilder()
			.setCustomId('deny')
			.setLabel('Refuser')
			.setStyle(ButtonStyle.Danger);

        const confirmationButtonRaw = new ActionRowBuilder().addComponents(acceptButton, denyButton)

        const response = await interaction.reply({
            content: `${adversaire}, une game contre ${interaction.user} ?`,
            components: [confirmationButtonRaw],
            withResponse: true
        });

        const confirmationCollectorFilter = i => i.user.id === adversaire.id

        try {
            const confirmation = await response.resource.message.awaitMessageComponent({
                filter: confirmationCollectorFilter,
                time: 5 * 60_000
            })

            if (confirmation.customId === 'accept') {
                const game = new Connect4DiscordGame(interaction.user, confirmation.user)
                
                const board = await game.updateBoardMessage(confirmation)
                    .then((board) => game.setGameButtonComponents(board.resource.message) )                

                while(!game.isEnded()) {
                    const played = await board.awaitMessageComponent({
                        filter: i => i.user.id === game.users[game.connect4Game.currentPlayer - 1].id
                    })
        
                    await game.userReacted(played, played.customId) 
                }

                board.edit({components: []})
                

            } else if (confirmation.customId === 'deny') {
                await confirmation.update({
                    content: "Partie refusée",
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


const bleu = "🔵";
const rouge = "🔴";
const blanc = "⚪️";
const separator = "----";
const reactionEmoji = { a: "🇦", b: "🇧", c: "🇨", d: "🇩", e: "🇪", f: "🇫", g: "🇬" }

class Connect4DiscordGame {
    constructor(user1, user2) {
        this.connect4Game = new Connect4Game(/*width: */7, /*height: */6, /*toAlign: */4);

        this.users = [user1, user2];
    
        this.controlsMessage = null;
        this.boardMessage = null;
    }

    setGameButtonComponents(message) {
        const gameButtons = Object.entries(reactionEmoji).map( ([emojiKey, emoji], i) => 
            new ButtonBuilder()
                .setCustomId(emojiKey)
                .setEmoji(emoji)
                .setStyle(ButtonStyle.Secondary)
        )

        return message.edit({ 
            components: [
                new ActionRowBuilder().addComponents(gameButtons.slice(0, 4)), 
                new ActionRowBuilder().addComponents(gameButtons.slice(4))
            ]
        });
    }

    updateBoardMessage(interaction) {
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
    
        return interaction.update({ 
            embeds: [{
                color: 3447003,
                description: this.getGameStringRepresentation()
                    + "\n" + currentGameStatus
            }],
            withResponse: true
        });
    };

    getGameStringRepresentation() {
        let stringLines = []
    
        stringLines.push(
            Object.values(reactionEmoji).join(separator)
        );

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

    userReacted(interaction, reaction) {    
        let column = Object.keys(reactionEmoji).indexOf(reaction);            

        this.connect4Game.play(column);
        return this.updateBoardMessage(interaction);
    }

    isEnded() {
        return this.connect4Game.winner !== null || this.connect4Game.boardIsFull();
    };
}


class Connect4Game {
    static EMPTY = 0
    static PLAYER_1 = 1
    static PLAYER_2 = 2

    constructor(width, height, toAlign) {
        this.boardWidth = width;
        this.boardHeight = height;
    
        this.board = null;
        this.toAlign = toAlign;
        this.resetBoard();
        this.currentPlayer = 1;
    
        this.winner = null;
    }

    resetBoard() {
        let board = [];
    
        for (let i = 0; i < this.boardHeight; i++) {
            let line = [];
            for (let j = 0; j < this.boardWidth; j++) {
                line.push(Connect4Game.EMPTY);
            }
            board.push(line);
        }
    
        this.board = board;
    }

    checkWinFromPoint(line, column) {
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
    }

    boardIsFull() {
        return this.board[this.boardHeight - 1].filter(x => x == Connect4Game.EMPTY).length == 0
    }

    play (column) {
        if (column < 0 || column >= this.boardWidth) { return; }
    
        let line = 0;
        while (line < this.boardHeight && this.board[line][column] != Connect4Game.EMPTY) {
            line += 1;
        }
    
        if (line == this.boardHeight) { return; }
    
        this.board[line][column] = this.currentPlayer;
        this.currentPlayer = this.currentPlayer == Connect4Game.PLAYER_1 ? Connect4Game.PLAYER_2 : Connect4Game.PLAYER_1;
    
        this.checkWinFromPoint(line, column);        
    }
}