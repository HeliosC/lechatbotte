const Discord = require("discord.js")
const client = new Discord.Client()
const { Client, MessageAttachment } = require('discord.js')


const chanIm = "images_videos_trop_lentes"
//const chanCh = "test"
const chanCh = "cest_ta_vie"
const nombot = "Le Chat Botté"
var nommodo = "🐾Chats sous chef"
var nomadmin = "🦄Le Chat en chef"


client.on('ready', () => { console.log(`Logged in as ${client.user.tag}!`) })


client.on('message', msg => {



  if (!msg.author.bot) {


    let modRole = msg.guild.roles.find("name", nommodo);
    let adminRole = msg.guild.roles.find("name", nomadmin);
    if (!(msg.member.roles.has(modRole.id) || msg.member.roles.has(adminRole.id))) {

      if (msg.content.toLocaleLowerCase().indexOf("pain au chocolat") != -1) {
        msg.reply("Chocolatine*")
      }
      
      if (msg.mentions.everyone) {
        //msg.channel.send("wow")
      } else {
        for (user of client.users) {
          if (user[1].username == nombot && user[1].bot && msg.isMemberMentioned(user[1])) {
            msg.reply("reste tranquile")
          }
        }
      }

      if (msg.channel.name == chanCh) {
        for (var [key, value] of msg.attachments) {
          client.channels.find('name', chanIm).send("" + msg.author + " : " + msg.content)
          client.channels.find('name', chanIm).send({ file: value.proxyURL })
          msg.channel.send("" + msg.author + " " + client.channels.find("name", chanIm))
          setTimeout(suiteTraitement, 500)
          function suiteTraitement() { msg.delete() }
          break
        }
      }
    }

    if (msg.content.indexOf("kalista") != -1) {
      msg.reply("kali quoi ?")
    }
    if (msg.content.indexOf("permis") != -1) {
      msg.channel.send("https://www.youtube.com/watch?v=MpQEi1Dw3_k&t=4s&ab_channel=Chatdesbois")
    }

  }



})
client.login(process.env.TOKENchat);
