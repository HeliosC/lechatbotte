const { Client, MessageAttachment, GatewayIntentBits } = require("discord.js");
//const Discord = require("discord.js");
//WEIRD, NEED TO FIND SMTH BETTER

const constants = require('./constants');
const Dispatcher = require('./Dispatcher');

const BotReactions = require('./actions/BotReactions');
//const pouepopo = require('./pouepopo.js')

const MotDePasse = require('./games/Motdepasse.js');
const Connect4 = require('./games/Connect4.js');
const Quiz = require('./games/Quiz.js');
const JDR = require('./games/JDR.js');

/* Chat Des Bois features */
const RolesManager = require('./actions/RolesManager');
//const Queue = require('./actions/Queue');
//const RedAlert = require('./actions/redAlert.js');
//const command_manager = require('./command_manager.js');
//const Quotes = require('./actions/Quotes.js');

/* Poulpita features */
//const Poulpita = require('./Poulpita.js');


function startBot(redisClient) {

	const client = new Client({ 
		intents: [
			GatewayIntentBits.Guilds, 
			GatewayIntentBits.GuildMessages,
			GatewayIntentBits.GuildMembers,
			GatewayIntentBits.GuildMessageReactions,
			GatewayIntentBits.MessageContent
		] 
	});

	client.on('ready', () => {
		console.log(`Logged in as ${client.user.tag}!`);

		/*client.channels.cache.find(channel => channel.id == constants.chatdesbois.channels.role)
		?.fetchMessage(constants.chatdesbois.channels.role)
		?.then(message => console.log("cannot fetch role message"))
		?.catch(console.error);*/

		/*client.channels.cache.find(val => val.name === 'devenir-un-fidèle').fetchMessage('643524258093334569')
		.then(message => console.log("PROUT2"))
			.catch(console.error);*/
 	});
	client.on("error", (e) => console.error(e));
	client.on("warn", (e) => console.warn(e));
	client.on("debug", (e) => console.info(e));

	const dispatcher = new Dispatcher(client);

	/******/
	dispatcher.addComponent(
		new BotReactions(client,constants.channels,constants.roles,constants.commandPrefix)
	);
	dispatcher.addComponent(
		new RolesManager(client, constants.channels.role)
	);
	/*dispatcher.addComponent(
		new Queue(client, constants.channels.queue, constants.roles)
	);*/
	dispatcher.addComponent(
		new MotDePasse(client, constants.channels.password)
	);
	dispatcher.addComponent(
		new Connect4(client, constants.channels.games, constants.roles)
	);
	dispatcher.addComponent(
		new Quiz(client, constants.channels.quiz)
	);
	dispatcher.addComponent(
		new JDR(client, constants.channels.jdr, redisClient, MessageAttachment)
	);
	/*dispatcher.addComponent(
		new command_manager(client, constants.roles, redisClient)
	);*/
	/*dispatcher.addComponent(
		new Poulpita(client, constants.roles, redisClient, Discord)
	);*/
	/*dispatcher.addComponent(
		new RedAlert(client, constants.roles, redisClient)
	);*/
	/*dispatcher.addComponent(
		new Quotes(client, constants.channels, constants.roles, redisClient, Discord)
	);*/
	/******/

	client.on('messageCreate', dispatcher.onMessage.bind(dispatcher));
	client.on('messageReactionAdd', dispatcher.onReaction.bind(dispatcher));
	client.on('messageReactionRemove', dispatcher.onReactionRemove.bind(dispatcher));

	/** Chat Des Bois Welcoming message */
	client.on('guildMemberAdd', (member) => {
		if (member.guild.id == constants.chatdesbois.server) {
			const h = client.emojis.cache.find(e => e.name == "hidesbois");
			client.channels.cache.find(c => c.id == constants.chatdesbois.channels.main).send(
				`Bienvenue par minou ${member} ! ${h}` 
				+ " Prends 30 secondes pour lire l'" + `${client.channels.cache.find(c => c.id == constants.chatdesbois.channels.reglement)}`
				+ " et réclame tes rôles dans " + `${client.channels.cache.find(c => c.id == constants.chatdesbois.channels.role)}` + " !"
			);
		}
	});


	client.login(process.env.TOKENchat);
	
	/** Handle role for my stream notification */
	/*client.on('messageReactionAdd', (reaction, user) => {
		if (reaction.message.id == 643524258093334569 // message devenir bg
			&& reaction.emoji.name == "GarconViande" ) { // meatboy
				const role = reaction.message.guild.roles.cache.find(val => val.name === 'Les fidèles');
				const member = reaction.message.guild.member(user);
				if(!member.roles.cache.has(role.id)){
					member.addRole(role);
				}			
			}
	})

	client.on('messageReactionRemove', (reaction, user) => {
		if (reaction.message.id == 643524258093334569 // message devenir bg
			&& reaction.emoji.name == "GarconViande" ) { // meatboy 
				const role = reaction.message.guild.roles.cache.find(val => val.name === 'Les fidèles');
				member = reaction.message.guild.member(user);
				if(member.roles.cache.has(role.id)){
					member.removeRole(role);
				}
			}	
	})*/

	//pouepopo.start(client)
}

module.exports.start = startBot;
