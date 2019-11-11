const Discord = require("discord.js");


const constants = require('./constants');
const Dispatcher = require('./Dispatcher');

const BotReactions = require('./actions/BotReactions');
const RolesManager = require('./actions/RolesManager');
const Queue = require('./actions/Queue');

const MotDePasse = require('./games/Motdepasse.js');
const Connect4 = require('./games/Connect4.js');
const Quiz = require('./games/Quiz.js');

const command_manager = require('./command_manager.js');

//var redis

function startBot(redisClient) {

	//redis = redisClient;

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
	dispatcher.addComponent(
		new Queue(client, constants.channels.queue, constants.rolesName)
	);
	dispatcher.addComponent(
		new MotDePasse(client, constants.channels.password)
	);
	dispatcher.addComponent(
		new Connect4(client, constants.channels.games, constants.rolesName)
	);
	dispatcher.addComponent(
		new Quiz(client, constants.channels.quiz)
	);
	dispatcher.addComponent(
		new command_manager(client, constants.rolesName, redisClient)
	);
	/******/

	client.on('message', dispatcher.onMessage.bind(dispatcher));
	client.on('messageReactionAdd', dispatcher.onReaction.bind(dispatcher));


	client.on('guildMemberAdd', (member) => {

		if (member.guild.name.indexOf("chats") != -1) {
			const h = client.emojis.find(e => e.name == "hidesbois");
			client.channels.find(c => c.name == "cest_ta_vie").send(
				"Bienvenu par minou " + member + " ! " + h
				+ " Prends 30 secondes pour lire l'" + client.channels.find(c => c.name == "accueil_deschats")
				+ " et réclame tes rôles dans " + client.channels.find(c => c.name == "adhesion_rôle") + " !"
			);
		}
	});


	client.login(process.env.TOKENchat);


	client.on('message', message => {
		if (message.author
			&& message.author.id == 255069392780394506 /*poui des bois*/
			&& message.channel.id == 548283395906600970 /* poui-et-krao-le-soir */) {
			message.react("🗡");
		}
	})

	client.on('messageReactionAdd', (reaction, user) => {
		if (message.id == 643443553942372362 /*message devenir bg*/
			&& reaction.name == "GarconViande" /* meatboy */) {
			message.react("🗡");
		}
	})

	client.on('messageReactionRemove', (reaction, user) => {
		if (message.id == 643443553942372362 /*message devenir bg*/
			&& reaction.name == "GarconViande" /* meatboy */) {
			message.react("🗡");
		}
	})
}


module.exports.start = startBot;
