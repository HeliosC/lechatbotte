const BDD = require('./bddmdp/BDDmdp.js')


var chanMdp

var areact = false
var MSG
var Nmot = 1
var score = 0
IG = false
IPG = false

var messageReactionAdd = function (reaction, user) {
    if (user.bot) { return }

    if (reaction.message.channel.name.indexOf(chanMdp) != -1) {
        reaction.remove(user)

        if (IPG || IG) {

            if (reaction.emoji.name == "yea") {
                if (IPG) {
                    begin()
                } else {
                    score += 1
                    Nmot += 1
                    affichage()
                }
            }

            if (reaction.emoji.name == "nay") {
                if (IPG) {
                    IPG = false
                    MSG.channel.send("Annulé !")
                } else {
                    Nmot += 1
                    affichage()
                }
            }

        }


    }


}

var message = function (msg) {

    if (msg.channel.name.indexOf(chanMdp) != -1) {

       // if (!IPG) { return }

        if (!msg.author.bot && msg.content.toLowerCase() == "*mdp") {

            msg.channel.send({
                embed: {
                    color: 3447003, description: //"SCORE : " + score
                        //           + "\nmot " + Nmot
                         "\n"+client.emojis.find("name", "yea")+" pour commencer"
                        + "\n"+client.emojis.find("name", "nay")+" pour annuler"
                }
            })
            areact = true

        }

        else if(!IPG && !IG) {      //IF BOT
            if (areact) {
                areact = false
                MSG = msg
                IPG = true
                var h = client.emojis.find("name", "yea");
                msg.react(h)
                h = client.emojis.find("name", "nay");
                setTimeout(() => { msg.react(h) }, 1000)

            }
        }

    }
}



function affichage() {
    MSG.edit({
        embed: {
            color: 3447003, description:  "SCORE : " + score
                //          + "\nmot " + Nmot + ":"
                          + "\n"+BDD.str[rd(0,BDD.str.length-1)]
        }
    })
}

function begin() {
    score = 0
    IPG = false
    IG = true
    affichage()
    setTimeout(() => {
        IG = false
        MSG.channel.send("TIME'S UP !")
    }, 90 * 1000);
}


function rd(min = 1, max = 25) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


var setParam = function (Mclient, MchanMdp) {
    chanMdp = MchanMdp
    client = Mclient
}

exports.message = message
exports.messageReactionAdd = messageReactionAdd
exports.setParam = setParam