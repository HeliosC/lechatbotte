const { SlashCommandBuilder, ContainerBuilder, UserSelectMenuBuilder, MessageFlags, TextDisplayBuilder, userMention } = require('discord.js');
const { createCanvas } = require('canvas');
const { start } = require('../../lechatbotte');
const { timestampToSnowflake } = require('../../discordUtil/DiscordSnowflake');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('guess_the_author')
		.setDescription('Devine qui a écrit un message !'),
    //getChannel: serverConfig => serverConfig?.channels?.games,
	async execute(interaction) {
        try {        
            const game = new GuessTheAuthor(interaction.user)
            const gameInteraction = await game.displayGameMessage(interaction) 
        
            const selectUserInteration = await gameInteraction.resource.message.awaitMessageComponent({
                filter: i => i.user.id == interaction.user.id,
                time: 5 * 60_000
            })

            await game.revealAnswer(selectUserInteration)
        } catch(error) {
            console.error("[Guess_the_author] " + error)
            return interaction.editReply({
                components: [new TextDisplayBuilder().setContent('Une erreur est survenue.')],
                flags: MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral,
            })        
        }
	}
};

class GuessTheAuthor {
    constructor(user) {
        this.user = user
        this.pickMessage = null
        this.selectedAuthor = null
    }

    async fetchMessage(channel) {
        const startDate = channel.createdTimestamp
        const now = Date.now()
        const randomDate = Math.floor(startDate + Math.random() * (now - startDate))

        const messages = await channel.messages.fetch({
            limit: 100,
            before: timestampToSnowflake(new Date(randomDate)),
            cache: false
        })

        if (messages.size == 0) {
            return null
        }

        for(let [id, message] of messages) {
            if(message.content && message.content.split(' ').length >= 3) {
                return message
            }
        }
        return null
    }

    async displayGameMessage(interaction) {
        const message = await this.fetchMessage(interaction.channel)
        this.pickMessage = message

        if (message == null) {
            return interaction.reply({
                content: 'Pas de message trouvé. Veillez Réessayer.',
                flags: MessageFlags.Ephemeral
            })
        }

        return interaction.reply({
            components: [this.buildGameContainer()],
            flags: MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral,
            withResponse: true
        })
    }

    revealAnswer(selectUserInteration) {
        this.selectedAuthor = selectUserInteration.users.last()

        return selectUserInteration.update({
            components: [this.buildGameContainer()],
            withResponse: true
        })
    }

    buildGameContainer() {
        let questionContainer = new ContainerBuilder()
            .addTextDisplayComponents((textDisplay) => textDisplay.setContent(`"${this.pickMessage.content}"`))

        if(this.selectedAuthor == null) {
            questionContainer = questionContainer.addActionRowComponents((actionRow) => actionRow.addComponents(
                new UserSelectMenuBuilder()
                    .setCustomId("userSelected")
                    .setPlaceholder("Devinez l'auteur")
                    .setMinValues(1)
                    .setMaxValues(1)
                )
            )
        } else {
            questionContainer = questionContainer.addTextDisplayComponents((textDisplay) => {
                if(this.selectedAuthor.id == this.pickMessage.author.id) {
                    return textDisplay.setContent(`
                        \n:white_check_mark: ${userMention(this.selectedAuthor.id)}
                        \n${this.pickMessage.url}
                    `)
                } else {
                    return textDisplay.setContent(`
                        \n:x: ${userMention(this.selectedAuthor.id)}
                        \nAnswer: ${userMention(this.pickMessage.author.id)}
                        \n${this.pickMessage.url}
                    `)
                }
            })
        }
         
        return questionContainer
    }
}