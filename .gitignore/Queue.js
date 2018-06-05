var index = require('./index.js');
var chanQ, nomadmin, nommodo

var listeAtt = []
var message = function (msg) {
  var msgl = msg.content.toLowerCase()
  let modo = msg.member.roles.has(msg.guild.roles.find("name", nommodo).id);
  let admin = msg.member.roles.has(msg.guild.roles.find("name", nomadmin).id);
  if (msg.channel.name.indexOf(chanQ) != -1) {
    if (msgl == "*join queue" || msgl == "*joinqueue" || msgl == "*jq") {
      if (listeAtt.indexOf(msg.author) == -1) {
        listeAtt[listeAtt.length] = msg.author
        msg.channel.send(msg.author + " est ajouté à la liste d'attente")
      } else {
        msg.channel.send(msg.author + " est déjà dans la liste d'attente")
      }
    }
    if (msgl == "*leave queue" || msgl == "*leavequeue" || msgl == "*lq") {
      var index = listeAtt.indexOf(msg.author)
      if (index != -1) {
        listeAtt.splice(index, 1)
        msg.channel.send(msg.author + " est retiré de la liste d'attente")
      } else {
        msg.channel.send(msg.author + " n'est pas déjà dans la liste d'attente")
      }
    }
    if (msgl == "*queue" || msgl == "*q") {
      if (listeAtt.length != 0) {
        afficheListe(msg.channel)
      } else {
        msg.channel.send("La liste d'attente est vide")
      }
    }
  }
  if (admin || modo) {
    if (msgl == "*next") {
      msg.channel.send(listeAtt.shift() + ", c'est a ton tour !")
    }
    if (msgl == "*clear") {
      listeAtt = []
      msg.channel.send("La liste d'attente a été vidée")
    }
    /*if (msgl == "*add") {
      msg.channel.send(listeAtt.shift() + ", c'est a ton tour !")
    }
    if (msgl == "*remove") {
      msg.channel.send(listeAtt.shift() + ", c'est a ton tour !")
    }*/
  }
}
function afficheListe(ch) {
  var msg = "Liste d'attente :\n"
  for (const [i, user] of listeAtt.entries()) {
    msg += (i + 1 + ": " + user.tag + "\n")
  }
  ch.send({ embed: { color: 3447003, description: msg } })
}


var setParam = function (MchanQ, Mnomadmin, Mnommodo) {
  chanQ = MchanQ
  nomadmin = Mnomadmin
  nommodo = Mnommodo
}


exports.message = message
exports.setParam = setParam
