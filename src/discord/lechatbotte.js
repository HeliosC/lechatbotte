const Discord = require("discord.js");

const Param = require('./Param.js');


const constants = require('./constants');
const Dispatcher = require('./Dispatcher');

const BotReactions = require('./actions/BotReactions');
const RolesManager = require('./actions/RolesManager');


function startBot() {
	const client = new Discord.Client();

	client.on('ready', () => { console.log(`Logged in as ${client.user.tag}!`) });
	client.on("error", (e) => console.error(e));
	client.on("warn", (e) => console.warn(e));
	client.on("debug", (e) => console.info(e));

	const dispatcher = new Dispatcher(client);

	/******/
	dispatcher.addComponent(
		new BotReactions(
				client,
				constants.channels,
				constants.rolesName,
				constants.commandPrefix
		)
	);
	dispatcher.addComponent(
		new RolesManager(client, constants.channels.role)
	);
	/******/

	client.on('message', dispatcher.onMessage.bind(dispatcher));
	client.on('messageReactionAdd', dispatcher.onReaction.bind(dispatcher));

	/* OLD way, to remove when rework terminated */

	Param.setParam(client);

	client.on('message', msg => {
		Param.message(msg);
	});

	client.on('messageReactionAdd', (reaction, user) => {
		Param.messageReactionAdd(reaction, user);
	});

	/* ***** */

	client.on('guildMemberAdd', (member) => {

		if (member.guild.name.indexOf("chats") != -1) {
			const h = client.emojis.find(e => e.name == "hidesbois");
			client.channels.find(c => c.name == "cest_ta_vie").send(
				"Bienvenu par minou " + member + " ! " + h
				+ " Prends 30 secondes pour lire l'" + client.channels.find(c => c.name == "accueil_deschats")
				// +" et le discord n'aura plus aucun secret pour toi !"
				+ " et réclame tes rôles dans " + client.channels.find(c => c.name == "adhesion_rôle") + " !"
			);
		}
	});


	client.login(process.env.TOKENchat);
}


module.exports.start = startBot;
