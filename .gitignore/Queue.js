const chanIm = "images_videos_trop_lentes"
const chanCh = "cest_ta_vie"
const nombot = "Le Chat Botté"
var nomdon = "🐱Chats de qualité supérieure"
var nomsub = "💕PUTAIN DE CHATONS"
var nommodo = "🐾Chats sous chef"
var nomadmin = "🦄Le Chat en chef"
var tagS = "²"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////LISTE D'ATTENTE///////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//var Queue = class {

  //constructor() {

    var listeAtt = []
    //client.on('message', msg => {
    var message = function(msg){
      var msgl = msg.content.toLowerCase()
      let modo = msg.member.roles.has(msg.guild.roles.find("name", nommodo).id);
      let admin = msg.member.roles.has(msg.guild.roles.find("name", nomadmin).id);
      if (msg.channel.name.indexOf("ttente") != -1) {
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
    }//)
    function afficheListe(ch) {
      var msg = "Liste d'attente :\n"
      for (const [i, user] of listeAtt.entries()) {
        msg += (i + 1 + ": " + user.tag + "\n")
      }
      ch.send({ embed: { color: 3447003, description: msg } })
    }


  //}
//}

exports.message = message
