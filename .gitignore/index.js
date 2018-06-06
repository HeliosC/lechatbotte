const Param = require('./Packages/Param.js');
const Discord = require("discord.js")
const client = new Discord.Client()

client.on('ready', () => { console.log(`Logged in as ${client.user.tag}!`) })
client.on("error", (e) => console.error(e));
client.on("warn", (e) => console.warn(e));
client.on("debug", (e) => console.info(e));

Param.setParam(client)

client.on('message', msg => {
    Param.message(msg)
})

client.on('messageReactionAdd', (reaction, user) => {
    Param.messageReactionAdd(reaction, user)
})


client.login(process.env.TOKENchat);
