const Param = require('./Packages/Param.js');
const Discord = require("discord.js")
const client = new Discord.Client()

client.on('ready', () => { console.log(`Logged in as ${client.user.tag}!`) })
client.on("error", (e) => console.error(e));
client.on("warn", (e) => console.warn(e));
client.on("debug", (e) => console.info(e));

Param.setParam(client)

var t = "0123456"
client.on('message', msg => {
    Param.message(msg)
})

client.on('messageReactionAdd', (reaction, user) => {
    Param.messageReactionAdd(reaction, user)
})

client.on('guildMemberAdd', (member) => {
    const h = client.emojis.find("name", "hey");
    client.channels.find('name', "cest_ta_vie").send("Bienvenu par minou "+member+" ! "+h)
})


//setTimeout(test,60*5*1000)

//setTimeout(Param.testsleepauto2,1*60*1000)

client.login(process.env.TOKENchat)
