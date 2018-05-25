const Discord = require("discord.js");
const client = new Discord.Client();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
  if (msg.content === "pong") {
    msg.reply("Ping!");
	msg.channel.send("YO MON POTE");
  }
});

client.login(process.env.TOKENchat);
