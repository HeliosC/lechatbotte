const BDD = require('./bddmdp/BDDmdp.js')


var chanMdp

var areact = false
var MSG
var Nmot = 1
var score = 0
IG = false
IPG = false
t = 90
k = 5
var player
//var userO = false

listeMots = BDD.str


var messageReactionAdd = function (reaction, user) {
    if (user.bot) { return }

    if (reaction.message.channel.name.indexOf(chanMdp) != -1) {
        reaction.remove(user)

        if ( (IPG || IG) && player == user) {

            if (reaction.emoji.name == "yea") {
                if (IPG) {
                    begin()
                } else {
                    mot = listeMots[rd(0, BDD.str.length - 1)]
                    score++
                    Nmot++
                    affichage()
                }
            }

            if (reaction.emoji.name == "nay") {
                if (IPG) {
                    IPG = false
                    MSG.channel.send("Annulé !")
                } else {
                    mot = listeMots[rd(0, BDD.str.length - 1)]
                    Nmot++
                    affichage()
                }
            }

        }


    }


}

var message = function (msg) {

    if (msg.channel.name.indexOf(chanMdp) != -1) {

        // if (!IPG) { return }

        if (!msg.author.bot && msg.content.toLowerCase() == "*mdp" && !IG) {

            player = msg.member.user
            console.log (msg.user)
            msg.channel.send({
                embed: {
                    color: 3447003, description: //"SCORE : " + score
                        //           + "\nmot " + Nmot
                    //   "\n" +
                    msg.author.tag +
                    "\n" + client.emojis.find("name", "yea") + " pour commencer"
                        + "\n" + client.emojis.find("name", "nay") + " pour annuler"
                }
            })
            areact = true

        }

        else if (!IG){// !IPG && !IG) {      //IF BOT
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


function countdown() {
    setTimeout(() => {
        if (t > 0) {
            t -= k
            //if(t==5){
            //    k=1
            //}
            affichage()
            countdown()
        }
    }, k * 1000);
}

function affichage() {
    MSG.edit({
        embed: {
            color: 3447003, description: 
            msg.author.tag +"\n"
            +"Temps : " + Math.trunc(t / 60) + "' " + t % 60 + "''" + "\n"
                + "Score : " + score
                //          + "\nmot " + Nmot + ":"
                + "\n\nMot : " + mot
        }
    })
}

function begin() {
    mot = listeMots[rd(0, BDD.str.length - 1)]
    score = 0
    t=90
    IPG = false
    IG = true
    affichage()
    countdown()
    setTimeout(() => {
        IG = false
        MSG.channel.send("TIME'S UP !")
    }, t * 1000);
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
