const Discord = require("discord.js")
const client = new Discord.Client()
const { Client, MessageAttachment } = require('discord.js')

const chanIm = "images_videos_trop_lentes"
const chanCh = "cest_ta_vie"
const nombot = "Le Chat Botté"
var nomdon = "🐱Chats de qualité supérieure"
var nomsub = "💕PUTAIN DE CHATONS"
var nommodo = "🐾Chats sous chef"
var nomadmin = "🦄Le Chat en chef"
var tagS = "²"


client.on('ready', () => { console.log(`Logged in as ${client.user.tag}!`) })
client.on('message', msg => {

  if (!msg.author.bot) {

    let don = msg.member.roles.has(msg.guild.roles.find("name", nomadmin).id);
    let sub = msg.member.roles.has(msg.guild.roles.find("name", nomadmin).id);
    let modo = msg.member.roles.has(msg.guild.roles.find("name", nommodo).id);
    let admin = msg.member.roles.has(msg.guild.roles.find("name", nomadmin).id);

    reponsesBot(msg, modo, admin)
    mentionsBot(msg, modo, admin,sub,don)

    if (!(modo || admin)) {
      deplaceImage(msg)
    } else {
      if (msg.author.username == "Helios") {
        parleBot(msg)
      }
    }
  }

})

function parleBot(msg) {
  if (msg.content.startsWith(tagS)) {
    msg.channel.send(msg.content.replace(tagS, ""))
    var boo = false
    for (var [key, value] of msg.attachments) {
      msg.channel.send({ file: value.proxyURL })
      boo = true
      break
    }
    if (boo) {
      setTimeout(suiteTraitement, 500)
      function suiteTraitement() { msg.delete() }
    } else {
      msg.delete()
    }
  }
}

function reponsesBot(msg, modo, admin) {
  var cont = msg.content.toLowerCase()
  if (cont.indexOf("kalista") != -1) {
    msg.reply("kali quoi ?")
  }
  if (cont.indexOf("permis") != -1) {
    msg.channel.send("https://www.youtube.com/watch?v=MpQEi1Dw3_k&t=4s&ab_channel=Chatdesbois")
  }
  if (cont.indexOf("ddlc") != -1 || cont.indexOf("doki") != -1 || cont.indexOf("monika") != -1 || cont.indexOf("yuri") != -1 || cont.indexOf("sayori") != -1 || cont.indexOf("natsuki") != -1) {
    const h = client.emojis.find("name", "monika");
    msg.react(h)
  }

  if (!(modo || admin)) {
    if (cont.indexOf("pain au chocolat") != -1) {
      msg.reply("Chocolatine*")
    }
  }

}

function mentionsBot(msg, modo, admin,sub,don) {
  if (msg.mentions.everyone) { } else {
    for (user of client.users) {
      if (user[1].username == nombot && user[1].bot && msg.isMemberMentioned(user[1])) {
        if (admin) {
          const h = client.emojis.find("name", "cheart");
          msg.react(h)
        } else if (modo) {
          if (msg.author.username == "Poui des bois") {
            msg.react("😍")
          } else if (msg.author.username == "Solis Le Soleil") {
            msg.react("🌞")
          } else if (msg.author.username == "Helios") {
            const h = client.emojis.find("name", "peachDab");
            msg.react(h)
          } else {
            msg.react("❤")
          }
        } else if(sub){
          msg.react("💕")
        }else if(don){
          msg.react("🐱")
        }else{
          msg.reply("reste tranquille")
        }
      }
    }
  }
}

function deplaceImage(msg) {
  if (msg.channel.name == chanCh) {
    for (var [key, value] of msg.attachments) {
      client.channels.find('name', chanIm).send("" + msg.author + " : " + msg.content)
      client.channels.find('name', chanIm).send({ file: value.proxyURL })
      msg.channel.send("" + msg.author + " : " + client.channels.find("name", chanIm))
      setTimeout(suiteTraitement, 500)
      function suiteTraitement() { msg.delete() }
      break
    }
  }
}






client.login(process.env.TOKENchat);
