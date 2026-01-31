const fs = require('node:fs');
const path = require('node:path');

const { Client, MessageAttachment, GatewayIntentBits, Events, Collection } = require("discord.js");
//const Discord = require("discord.js");
//WEIRD, NEED TO FIND SMTH BETTER

const constants = require('./constants');
const Dispatcher = require('./events/Dispatcher.js');
const interactionCreate = require('./events/interactionCreate.js');

const BotReactions = require('./actions/BotReactions');
//const pouepopo = require('./pouepopo.js')

//const MotDePasse = require('./games/Motdepasse.js');
//const Connect4 = require('./games/Connect4.js');
//const Quiz = require('./games/Quiz.js');
//const JDR = require('./games/JDR.js');

/* Chat Des Bois features */
const RolesManager = require('./actions/RolesManager');
//const Queue = require('./actions/Queue');
//const RedAlert = require('./actions/redAlert.js');
//const command_manager = require('./command_manager.js');
//const Quotes = require('./actions/Quotes.js');

/* Poulpita features */
//const Poulpita = require('./Poulpita.js');


/* 
* trace / debug / info / warn / error / silent 
* Only discord log for now
*/
const logLevels = { "silent" : 0, "error" : 1, "warn" : 2, "info" : 3, "debug" : 4, "trace" : 5 }
const LOG_LEVEL = Object.entries(logLevels).find(l => l[0] == process.env.LOG_LEVEL)?.[1] ?? logLevels["trace"]

console.log("LOG LEVEL " + LOG_LEVEL)

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


	//generate commands object
	client.commands = new Collection();
	const foldersPath = path.join(__dirname, 'commands');
	const commandFolders = fs.readdirSync(foldersPath);

	for (const folder of commandFolders) {
		const commandsPath = path.join(foldersPath, folder);
		const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
		for (const file of commandFiles) {
			const filePath = path.join(commandsPath, file);
			const command = require(filePath);
			// Set a new item in the Collection with the key as the command name and the value as the exported module
			if ('data' in command && 'execute' in command) {
				client.commands.set(command.data.name, command);
			} else {
				console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
			}
		}
	}


	client.once(Events.ClientReady, () => {
		console.log(`Logged in as ${client.user.tag}!`);

		/*client.channels.cache.find(channel => channel.id == constants.chatdesbois.channels.role)
		?.fetchMessage(constants.chatdesbois.channels.role)
		?.then(message => console.log("cannot fetch role message"))
		?.catch(console.error);*/

		/*client.channels.cache.find(val => val.name === 'devenir-un-fidèle').fetchMessage('643524258093334569')
		.then(message => console.log("PROUT2"))
			.catch(console.error);*/
 	});

	client.on(Events.Error, (e) => {
		if(logLevels["error"] <= LOG_LEVEL) console.error(e)
	});
	client.on(Events.Warn, (e) => {
		if(logLevels["warn"] <= LOG_LEVEL) console.warn(e)
	});
	client.on(Events.Debug, (e) => {
		if(logLevels["debug"] <= LOG_LEVEL) console.debug(e)
	});

	const dispatcher = new Dispatcher(client);

	/******/
	dispatcher.addComponent(
		new BotReactions(client,constants.helios.channels,constants.helios.roles,constants.commandPrefix)
	);
	dispatcher.addComponent(
		new RolesManager(client, constants.helios.channels.role)
	);
	/*dispatcher.addComponent(
		new Queue(client, constants.helios.channels.queue, constants.helios.roles)
	);*/
	/*dispatcher.addComponent(
		new MotDePasse(client, constants.helios.channels.password)
	);*/
	/*dispatcher.addComponent(
		new Connect4(client, constants.helios.channels.games, constants.helios.roles)
	);*/
	/*dispatcher.addComponent(
		new Quiz(client, constants.helios.channels.quiz)
	);*/
	/*dispatcher.addComponent(
		new JDR(client, constants.helios.channels.jdr, redisClient, MessageAttachment)
	);*/
	/*dispatcher.addComponent(
		new command_manager(client, constants.helios.roles, redisClient)
	);*/
	/*dispatcher.addComponent(
		new Poulpita(client, constants.helios.roles, redisClient, Discord)
	);*/
	/*dispatcher.addComponent(
		new RedAlert(client, constants.helios.roles, redisClient)
	);*/
	/*dispatcher.addComponent(
		new Quotes(client, constants.helios.channels, constants.helios.roles, redisClient, Discord)
	);*/
	/******/

	client.on(Events.MessageCreate, dispatcher.onMessage.bind(dispatcher));
	client.on(Events.MessageReactionAdd, dispatcher.onReaction.bind(dispatcher));
	client.on(Events.MessageReactionRemove, dispatcher.onReactionRemove.bind(dispatcher));
	client.on(Events.InteractionCreate, interactionCreate.execute);

	/** Chat Des Bois Welcoming message */
	client.on(Events.GuildMemberAdd, (member) => {
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
