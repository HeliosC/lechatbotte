var Queue = require('./Queue.js');
var BotReactions = require('./BotReactions.js');
var Connect4 = require('./Connect4.js')

const Discord = require("discord.js")
const client = new Discord.Client()
const { Client, MessageAttachment } = require('discord.js')
client.on('ready', () => { console.log(`Logged in as ${client.user.tag}!`) })
client.on("error", (e) => console.error(e));
client.on("warn", (e) => console.warn(e));
client.on("debug", (e) => console.info(e));


BotReactions.setClient(client)
Connect4.setClient(client)


const chanIm = "images_videos_trop_lentes"
const chanCh = "cest_ta_vie"
const nombot = "Le Chat Botté"
var nomdon = "🐱Chats de qualité supérieure"
var nomsub = "💕PUTAIN DE CHATONS"
var nommodo = "🐾Chats sous chef"
var nomadmin = "🦄Le Chat en chef"
var tagS = "²"



client.on('message', msg => {

    /*if (!msg.author.bot) {
        msg.reply(" ca va ")
    }*/
    
    Queue.message(msg)
    BotReactions.message(msg)
    Connect4.message(msg)

})

client.on('messageReactionAdd', (reaction, user) => {

    Connect4.messageReactionAdd(reaction, user)

})

client.login(process.env.TOKENchat);
