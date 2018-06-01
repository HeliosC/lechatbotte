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

var Lmin = ["a", "b", "c", "d", "e", "f", "g"]


const fleche = "⬇️       "
const bleu = "🔵       "
const rouge = "🔴       "
const blanc = "⚪️       "
//const l = "🔵🔵🔵🔵🔵🔵🔵\n"
//const l2 = "⚪️⚪️⚪️⚪️⚪️⚪️⚪️\n"
const L = ["🇦", "🇧", "🇨", "🇩", "🇪", "🇫", "🇬"]

var MSG
var MSGreact
var jeu = [[blanc, blanc, blanc, blanc, blanc, blanc, blanc], [blanc, blanc, blanc, blanc, blanc, blanc, blanc], [blanc, blanc, blanc, blanc, blanc, blanc, blanc], [blanc, blanc, blanc, blanc, blanc, blanc, blanc], [blanc, blanc, blanc, blanc, blanc, blanc, blanc], [blanc, blanc, blanc, blanc, blanc, blanc, blanc]]
var j1 = true
var user1, user2

var areact = false
var IG = false
var remov = false
var joue = false
var msgb = false

client.on('ready', () => { console.log(`Logged in as ${client.user.tag}!`) })

client.on("error", (e) => console.error(e));
client.on("warn", (e) => console.warn(e));
client.on("debug", (e) => console.info(e));

client.on('messageReactionAdd', (reaction, user) => {
    if (user.bot) { return }
    //channel.send(""+reaction)

    console.log(reaction.message.id)
    console.log(MSGr.content.id)

    if (reaction.message.id == MSG.id) {console.log("ok");reaction.remove(user); return } 
    if (reaction.message.id == MSGr.id) {console.log("okr") } else {console.log("pas okr"); return }



    if (remov) {
        reaction.remove(user)
        if (!joue) { return }

        x = L.indexOf(reaction.emoji.toString())
        //MSG.edit("oups")
        y = 5
        while (y >= 0 && jeu[y][x] != blanc) { y -= 1 }
        if (y == -1) {
            //console.log("c'est plein")
        } else {
            //console.log(n)
            if (j1 && user == user1) {
                jeu[y][x] = bleu
                j1 = false
                MSG.edit(affiche() + "\nTour de : " + user2)
            } else if (!j1 && user == user2) {
                jeu[y][x] = rouge
                j1 = true
                MSG.edit(affiche() + "\nTour de : " + user1)
            }
            //console.log(jeu[n][1])


        }
    }

})

client.on('message', msg => {

    let modo = msg.member.roles.has(msg.guild.roles.find("name", nommodo).id);
    let admin = msg.member.roles.has(msg.guild.roles.find("name", nomadmin).id);


    if (remov && msg.author.bot && !msgb) {
        msgb = true
        MSG = msg
    }

    if (areact && msg.author.bot) {

            MSGr = msg

        //console.log(" MSGr " + MSGr.content)
        areact = false
        var n = 0
        A()
        function A() {
            if (n < 7) {
                msg.react(L[n])
                n++
                setTimeout(A, 1000)
            }
        }

        //msg.channel.send((blanc.repeat(7) + "\n").repeat(6))
        remov = true
        msg.channel.send(affiche())
        setTimeout(() => {
            joue = true
            MSG.edit(affiche() + "\nTour de : " + user1)
        }, 7000);

    }

    if (!msg.author.bot) {


        if (msg.content == "*stop" && IG && (msg.author == user1 || msg.author == user2 || admin || modo)) {
            MSG.edit(affiche() + "\nPartie annulée")
            reset()
            console.log("" + IG)
        }

        if (msg.content.startsWith("*C4") && !IG) {

            var pls = Array.from(msg.mentions.users.values())
            if (pls.length == 0) { return }

            var pl = pls[0].username

            user1 = msg.author
            user2 = pls[0]

            console.log(user1.username + "  " + user2.username)

            console.log("a " + pl)
            //console.log("a " +pl[0].username )




            msg.channel.send(fleche.repeat(7))
            areact = true
            //client.emit('message', fleche.repeat(7));

            IG = true
        }

    }



})



function affiche() {
    tab = ""
    for (var x of jeu) {
        for (var y of x) {
            tab += y
        }
        tab += "\n"
    }
    return (tab)
}

function reset() {
    jeu = [[blanc, blanc, blanc, blanc, blanc, blanc, blanc], [blanc, blanc, blanc, blanc, blanc, blanc, blanc], [blanc, blanc, blanc, blanc, blanc, blanc, blanc], [blanc, blanc, blanc, blanc, blanc, blanc, blanc], [blanc, blanc, blanc, blanc, blanc, blanc, blanc], [blanc, blanc, blanc, blanc, blanc, blanc, blanc]]
    j1 = true
    user1, user2

    areact = false
    IG = false
    remov = false
    joue = false
    msgb = false
}

client.on('message', msg => {

  if (!msg.author.bot) {

    let don = msg.member.roles.has(msg.guild.roles.find("name", nomdon).id);
    let sub = msg.member.roles.has(msg.guild.roles.find("name", nomsub).id);
    let modo = msg.member.roles.has(msg.guild.roles.find("name", nommodo).id);
    let admin = msg.member.roles.has(msg.guild.roles.find("name", nomadmin).id);

    reponsesBot(msg, admin, modo)
    mentionsBot(msg, admin, modo, sub, don)

    if (!(admin||modo)) {
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

function reponsesBot(msg, admin, modo) {
  var cont = msg.content.toLowerCase()
  if (cont.indexOf("kalista") != -1) {
    msg.reply("kali quoi ?")
  }
  if (cont.indexOf("permis") != -1) {
    msg.channel.send("https://www.youtube.com/watch?v=MpQEi1Dw3_k&t=4s&ab_channel=Chatdesbois")
  }
  if (cont.indexOf("ddlc") != -1 || cont.indexOf("doki") != -1 || cont.indexOf("monika") != -1 || cont.indexOf("yuri") != -1 || cont.indexOf("sayori") != -1 || cont.indexOf("natsuki") != -1) {
    const h = client.emojis.find("name", "monika");
    //msg.react(h)
    msg.channel.send(""+h)
  }

  if (!(modo || admin)) {
    if (cont.indexOf("pain au chocolat") != -1) {
      msg.reply("Chocolatine*")
    }
  }

}

function mentionsBot(msg, admin, modo, sub, don) {
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
      //client.channels.find('name', chanIm).send("" + msg.author + " : " + msg.content,{ file: value.proxyURL })
      client.channels.find('name', chanIm).send(msg.author + " : " + msg.content)
      client.channels.find('name', chanIm).send({ file: value.proxyURL })
      msg.channel.send(msg.author + " : " + client.channels.find("name", chanIm))
      setTimeout(suiteTraitement, 500)
      function suiteTraitement() { msg.delete() }
      break
    }
  }
}


client.login(process.env.TOKENchat);
