var nomdon, nomsub, nommodo, nomadmin, client, nombot, chanCh, chanIm, TagS



var message = function (msg) {
  if (!msg.author.bot) {


    admin = false; modo = false; sub = false; don = false;
    if (msg.guild.roles.find("name", nommodo) != null) {
      don = msg.member.roles.has(msg.guild.roles.find("name", nomdon).id);
      sub = msg.member.roles.has(msg.guild.roles.find("name", nomsub).id);
      modo = msg.member.roles.has(msg.guild.roles.find("name", nommodo).id);
      admin = msg.member.roles.has(msg.guild.roles.find("name", nomadmin).id);
    }


    reponsesBot(msg, admin, modo, client)
    mentionsBot(msg, admin, modo, sub, don, client)

    if (!(admin || modo)) {
      deplaceImage(msg, client)
    } else {
      if (msg.author.username == "Helios ⭐⭐") {
        parleBot(msg)
      }
    }
  }

}

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


  if (cont.startsWith("!snap")) {
    msg.channel.send("Tu veux vraiment voir tout le ramassis de merde que j'peux produire ? A tes risques et périls l'ami : chat_desbois")
  }

  if (cont.startsWith("!facebook") || cont.startsWith("!fb")) {
    msg.channel.send("J'suis aussi présente sur le Facebook game, donc viens lâcher un follow, ça mange pas d'chèvres, et ça fait augmenter les stats, donc stop faire pd d'homophobe, stp. ♥ https://www.facebook.com/Chatsdesbois/")
  }

  if (cont.startsWith("!insta") || cont.startsWith("!ig")) {
    msg.channel.send("Viens voir mes petites photo de mes chats et autres beautés artistiques ! ♥ https://www.instagram.com/unejeune/")
  }

  if (cont.startsWith("!twitter")) {
    msg.channel.send("Follow pour suivre mes actus ! ♥ https://twitter.com/Chatdesbois_?lang=fr")
  }


  if (cont.indexOf("kalista") != -1) {
    //msg.reply("kali quoi ?")
  }
  if (cont.indexOf("permis") != -1) {
    //msg.channel.send("https://www.youtube.com/watch?v=MpQEi1Dw3_k&t=4s&ab_channel=Chatdesbois")
  }
  if (cont.indexOf("ddlc") != -1 || cont.indexOf("doki") != -1 || cont.indexOf("monika") != -1 || cont.indexOf("yuri") != -1 || cont.indexOf("sayori") != -1 || cont.indexOf("natsuki") != -1) {
    const h = client.emojis.find("name", "monika");
    msg.react(h)
    //msg.channel.send("" + h)
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
          } else if (msg.author.username == "Helios ⭐⭐") {
            //msg.author.send("yo")
            //client.users.find('username', "Helios ⭐⭐").send("yo2")
            const h = client.emojis.find("name", "peachDab");
            msg.react(h)
          } else {
            msg.react("❤")
          }
        } else if (sub) {
          msg.react("💕")
        } else if (don) {
          msg.react("🐱")
        } else {
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
      //client.channels.find('name', chanIm).send(msg.author + " : " + msg.content)
      client.channels.find('name', chanIm).send(client.channels.find("name", chanCh) + "\n" + msg.author + " : " + msg.content)
      client.channels.find('name', chanIm).send({ file: value.proxyURL })
      msg.channel.send(msg.author + " : " + client.channels.find("name", chanIm))
      setTimeout(suiteTraitement, 500)
      function suiteTraitement() { msg.delete() }
      break
    }
  }
}


var setParam = function (MchanIm, MchanCh, Mnombot, Mnomadmin, Mnommodo, Mnomsub, Mnomdon, Mclient, MtagS) {
  chanIm = MchanIm
  chanCh = MchanCh
  nombot = Mnombot
  nomadmin = Mnomadmin
  nommodo = Mnommodo
  nomsub = Mnomsub
  nomdon = Mnomdon
  client = Mclient
  tagS = MtagS
}

exports.message = message
exports.setParam = setParam
