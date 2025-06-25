const { MessageFlags, Events, Constants } = require('discord.js');
const constants = require('../constants');

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {
		if (interaction.isChatInputCommand()) {
			const command = interaction.client.commands.get(interaction.commandName);
	
			if (!command) {
				console.error(`No command matching ${interaction.commandName} was found.`);
				return;
			}
	
			try {
				const serverConst = Object.values(constants).find(e => e.server === interaction.guildId)
				const channelRequired = command.getChannel?.(serverConst)
				const testChannel = serverConst?.channels?.test

				if(!channelRequired || interaction.channelId === channelRequired || interaction.channelId === testChannel) {
					await command.execute(interaction);
				} else {
					await interaction.reply({ content: `Utilisez cette commande dans <#${channelRequired}>`, flags: MessageFlags.Ephemeral });
				}
			} catch (error) {
				console.error(error);
				if (interaction.replied || interaction.deferred) {
					await interaction.followUp({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral });
				} else {
					await interaction.reply({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral });
				}
			}

		} else if (interaction.isAutocomplete()) {
			const command = interaction.client.commands.get(interaction.commandName);
	
			if (!command) {
				console.error(`No command matching ${interaction.commandName} was found.`);
				return;
			}

			try {
				await command.autocomplete(interaction);
			} catch (error) {
				console.error(error);
			}

		} else if (interaction.isUserContextMenuCommand()) {
			const command = interaction.client.commands.get(interaction.commandName);

			if (!command) {
				console.error(`No command matching ${interaction.commandName} was found.`);
				return;
			}

			try {
				await command.execute(interaction);
			} catch (error) {
				console.error(error);
			}

		} else if (interaction.isMessageContextMenuCommand()) {
			const command = interaction.client.commands.get(interaction.commandName);

			if (!command) {
				console.error(`No command matching ${interaction.commandName} was found.`);
				return;
			}

			try {
				await command.execute(interaction);
			} catch (error) {
				console.error(error);
			}

		} else if (interaction.isModalSubmit()) {
			const command = interaction.client.commands.find(c => c.modalIds?.includes(interaction.customId))

			if (!command) {
				console.error(`No command matching ${interaction.commandName} was found.`);
				return;
			}

			try {
				await command.modalSubmit(interaction);
			} catch (error) {
				console.error(error);
			}

		} 
	}
};