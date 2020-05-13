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

const Poulpita = require('./Poulpita.js');

//const pouepopo = require('./pouepopo.js')

function startBot(redisClient) {

	const client = new Discord.Client();

	client.on('ready', () => {
		console.log(`Logged in as ${client.user.tag}!`);
		client.channels.find(val => val.name === constants.channels.role).fetchMessage('710166926168555590')
		.then(message => console.log("PROUT1"))
		.catch(console.error);
		client.channels.find(val => val.name === 'devenir-un-fidèle').fetchMessage('643524258093334569')
		.then(message => console.log("PROUT2"))
			.catch(console.error);
 	});
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
	dispatcher.addComponent(
		new Poulpita(client, constants.rolesName, redisClient, Discord)
	);
	/******/

	client.on('message', dispatcher.onMessage.bind(dispatcher));
	client.on('messageReactionAdd', dispatcher.onReaction.bind(dispatcher));
	client.on('messageReactionRemove', dispatcher.onReactionRemove.bind(dispatcher));

	client.on('guildMemberAdd', (member) => {
		if (member.guild.name.indexOf("chats") != -1) {
			const h = client.emojis.find(e => e.name == "hidesbois");
			client.channels.find(c => c.name == constants.channels.chanCh).send(
				"Bienvenue par minou " + member + " ! " + h
				+ " Prends 30 secondes pour lire l'" + client.channels.find(c => c.id == 299124426866294787)
				+ " et réclame tes rôles dans " + client.channels.find(c => c.name == "✅│adhesion-rôles") + " !"
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
		if(message.content.toLowerCase() == "ou alors" && message.guild.id == "350708761226117122" ){
			message.channel.send("c'est un bot")
		}
	})
	
	client.on('messageReactionAdd', (reaction, user) => {
		if (reaction.message.id == 643524258093334569 /*message devenir bg*/
			&& reaction.emoji.name == "GarconViande" /* meatboy */) {
				const role = reaction.message.guild.roles.find(val => val.name === 'Les fidèles');
				const member = reaction.message.guild.member(user);
				if(!member.roles.has(role.id)){
					member.addRole(role);
				}			
			}
	})

	client.on('messageReactionRemove', (reaction, user) => {
		if (reaction.message.id == 643524258093334569 /*message devenir bg*/
			&& reaction.emoji.name == "GarconViande" /* meatboy */) {
				const role = reaction.message.guild.roles.find(val => val.name === 'Les fidèles');
				member = reaction.message.guild.member(user);
				if(member.roles.has(role.id)){
					member.removeRole(role);
				}
			}	
	})
	//pouepopo.start(client)
}

module.exports.start = startBot;
