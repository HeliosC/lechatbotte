const Discord = require("discord.js");

const Param = require('./Param.js');


function startBot() {
	const client = new Discord.Client();

	client.on('ready', () => { console.log(`Logged in as ${client.user.tag}!`) });
	client.on("error", (e) => console.error(e));
	client.on("warn", (e) => console.warn(e));
	client.on("debug", (e) => console.info(e));

	Param.setParam(client);

	client.on('message', msg => {
	    Param.message(msg);
	});

	client.on('messageReactionAdd', (reaction, user) => {
	    Param.messageReactionAdd(reaction, user);
	});

	client.on('guildMemberAdd', (member) => {

	    if (member.guild.name.indexOf("chats") != -1) {
	        const h = client.emojis.find("name", "hidesbois");
	        client.channels.find('name', "cest_ta_vie").send("Bienvenu par minou "+member+" ! "+h + " Prends 30 secondes pour lire l'"+client.channels.find("name", "accueil_deschats")
	        // +" et le discord n'aura plus aucun secret pour toi !"
	        +" et réclame tes rôles dans "+client.channels.find("name", "adhesion_rôle") + " !"
	        );
	    }
	});


	client.login(process.env.TOKENchat);
}


module.exports.start = startBot;
