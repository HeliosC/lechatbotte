var chanQ, nomadmin, nommodo;

var listeAtt = [];
var message = function (msg) {
  var msgl = msg.content.toLowerCase();

  /*modo = false
  admin = false
  try {
  let modo = msg.member.roles.has(msg.guild.roles.find("name", nommodo).id);
  let admin = msg.member.roles.has(msg.guild.roles.find("name", nomadmin).id);
   }
   catch (error) {
     //modo = false
     //admin = false
     //console.log(error)
   }*/

   admin = false; modo = false;
   if (msg.guild.roles.find(r => r.name == nommodo) != null) {
      modo = msg.member.roles.has(msg.guild.roles.find(r => r.name == nommodo).id);
      admin = msg.member.roles.has(msg.guild.roles.find(r => r.name == nomadmin).id);
   }
//}


  if (msg.channel.name.indexOf(chanQ) != -1 || modo || admin) {
    if (msgl == "*join queue" || msgl == "*joinqueue" || msgl == "*jq") {
      /*
      if (listeAtt.indexOf(msg.author) == -1) {
        listeAtt[listeAtt.length] = msg.author
        msg.channel.send(msg.author + " est ajouté à la liste d'attente")
      } else {
        msg.channel.send(msg.author + " est déjà dans la liste d'attente")
      }
      */
      add(msg.author, msg.channel);
    }
    if (msgl == "*leave queue" || msgl == "*leavequeue" || msgl == "*lq") {
      rem(msg.author, msg.channel)
      /*
      var index = listeAtt.indexOf(msg.author)
      if (index != -1) {
        listeAtt.splice(index, 1)
        msg.channel.send(msg.author + " est retiré de la liste d'attente")
      } else {
        msg.channel.send(msg.author + " n'est pas déjà dans la liste d'attente")
      }
      */
    }
    if (msgl == "*queue" || msgl == "*q") {
      if (listeAtt.length != 0) {
        afficheListe(msg.channel);
      } else {
        msg.channel.send("La liste d'attente est vide");
      }
    }
    if (msgl == "*help" || msgl == "*?") {
      msg.channel.send({
        embed: {
          color: 3447003, description:
            "Pour rejoindre la liste d'attente : *joinqueue / *jq \nPour la quitter : *leavequeue / *lq \nPour l'afficher : *queue / *q"
        }
      });
    }
  }

  if (admin || modo) {
    if (msgl == "*next") {
      if (listeAtt.length == 0) {
        msg.channel.send("La liste d'attente est vide !");
        return;
      }
      msg.channel.send(listeAtt.shift() + ", c'est a ton tour ! Rejoins le channel 'Viewers anti-sel' pour être switch");
      if (listeAtt.length == 0) {
        msg.channel.send("La liste d'attente est maintenant vide !");
      }
    }
    if (msgl == "*clear") {
      listeAtt = [];
      msg.channel.send("La liste d'attente a été vidée");
    }

    if (msgl.startsWith("*add")) {
      var n = msgl[4];
      var pls = Array.from(msg.mentions.users.values());
      if (pls.length == 0) { return }

      var p = pls[0];
      if (n != undefined && n != " ") {
        if (n < 1) {
          n = 1
          msg.channel.send(p + " est ajouté à la liste d'attente en position : " + n);
          listeAtt.splice(0, 0, p);
        } else if (n <= listeAtt.length) {
          msg.channel.send(p + " est ajouté à la liste d'attente en position : " + n);
          listeAtt.splice(n - 1, 0, p);
        } else {
          add(p, msg.channel);
        }
      } else {
        add(p, msg.channel);
      }


      //for (var [i, p] of msg.mentions.users) {
      //add(p,msg.channel)
      //}


      /*if (n != undefined && n != " ") {
        if (n > listeAtt.length && n > 0) {
          msg.channel.send("Personne n'est à cete position")
        } else {
          msg.channel.send(listeAtt[n - 1].username + " est retiré de la liste")
          listeAtt.splice(n - 1, 1)
        }
      }*/
    }

    if (msgl.startsWith("*remove")) {
      var n = msgl[7];
      if (n != undefined && n != " ") {
        if (n > listeAtt.length && n > 0) {
          msg.channel.send("Personne n'est à cete position");
        } else {
          msg.channel.send(listeAtt[n - 1].username + " est retiré de la liste d'attente");
          listeAtt.splice(n - 1, 1);
        }
      } else {
        var pls = Array.from(msg.mentions.users.values());
        if (pls.length == 0) { return }
        p = pls[0];
        rem(p, msg.channel);
      }
    }
  }
}

function afficheListe(ch) {
  var msg = "Liste d'attente :\n";
  for (const [i, user] of listeAtt.entries()) {
    msg += (i + 1 + ": " + user.tag + "\n");
  }
  ch.send({ embed: { color: 3447003, description: msg } })
}

function add(p, ch) {
  if (listeAtt.indexOf(p) == -1) {
    listeAtt[listeAtt.length] = p;
    ch.send(p + " est ajouté à la liste d'attente");
  } else {
    ch.send(p + " est déjà dans la liste d'attente");
  }
}

function rem(p, ch) {
  var index = listeAtt.indexOf(p);
  if (index != -1) {
    listeAtt.splice(index, 1);
    ch.send(p + " est retiré de la liste d'attente");
  } else {
    ch.send(p + " n'est pas dans la liste d'attente");
  }
}


var setParam = function (MchanQ, Mnomadmin, Mnommodo) {
  chanQ = MchanQ;
  nomadmin = Mnomadmin;
  nommodo = Mnommodo;
}


exports.message = message;
exports.setParam = setParam;
