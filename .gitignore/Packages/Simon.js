const chanIm = "images_videos_trop_lentes"
const chanCh = "cest_ta_vie"
const chanQ = "attente"
const chanJeux = "jeux"
const chanQuiz = "quiz"

const nombot = "Le Chat Botté"

const nomdon = "🐱Chats de qualité supérieure"
const nomsub = "💕PUTAIN DE CHATONS"
const nommodo = "🐾Chats sous chef"
const nomadmin = "🦄Le Chat en chef"

var InLevel = false
var lvl = 1
var start = false
var areact = false
var MSG
var client

var LvlColors = []

const rouge = 0xff0000
const bleu = 0x0080ff
const vert = 0x00ff80
const jaune = 0xffff80

const colors = [rouge, bleu, vert, jaune]

L = ["❤", "💙", "💚", "💛"]

//    💛 💙 💜 💚 ❤


var message = function (msg) {

    if (msg.channel.name.indexOf(chanJeux) != -1) {

        if (msg.content.toLowerCase().startsWith("*simon")) {
            start = true
            msg.channel.send({
                embed: {
                    color: 0,
                    description: "<-- On va commencer"
                }
            })

        }

        if (msg.author.bot && start) { // && msg.content == "<-- On va commencer"){
            start = false
            MSG = msg
            areact = true
            var x = setInterval(() => {
                SetColor(colors[rd()], 5000, "<--")
            }, 5000);

            setTimeout(() => {
                clearInterval(x)
            }, 1000);

        }

        if (msg.author.bot && areact) {
            areact = false
            //var h = client.emojis.find("name", "yellow_heart")
            var n = 0
            A()
            function A() {
                if (n < 4) {
                    msg.react(L[n])
                    n++
                    setTimeout(A, 2000)
                } else {
                    MSG.edit({
                        embed: {
                            color: 0,
                            description: "<-- GO"
                        }
                    })


                    //level = true
                    lvl = 1
                    setTimeout(() => {
                        MSG.edit({
                            embed: {
                                color: 0,
                                description: "LEVEL " + lvl
                            }
                        })
                    }, 500);
                    setTimeout(() => {
                        level(lvl)
                    }, 3000);


                }
            }

        }
    }

}



var messageReactionAdd = function (reaction, user) {

    if (reaction.message.channel.name.indexOf(chanJeux) != -1
        && !user.bot && reaction.message.id == MSG.id) {

        //reaction.remove(user)

        if (!InLevel) { reaction.remove(user); return }
        x = L.indexOf(reaction.emoji.toString())

        SetColor(colors[x], 500, "<-- A TOI")
        console.log(reaction)
        setTimeout(() => {
            reaction.remove(user)
        }, 500);

        y = LvlColors.splice(0, 1)

        if (x != y) {
            console.log("hzhzhzhz")
            //SetColor(0, 500, "PERDU, SCORE : " + lvl)

            /*setTimeout(() => {
                MSG.edit({
                    embed: {
                        color: 0,
                        description: "PERDU, SCORE : " + lvl - 1
                    }
                })
            }, 1000);*/

            setTimeout(() => {
                MSG.edit({
                    embed: {
                        color: 0,
                        description: "PERDU, SCORE : " + (lvl - 1)
                    }
                })
            },1000)

            /*MSG.edit({
                embed: {
                    color: 0,
                    description: "PERDU, SCORE : " + lvl
                }
            })*/
            InLevel = false
            //lvl = 1
        } else {
            if (LvlColors.length == 0) {
                InLevel = false
                lvl += 1
                setTimeout(() => {
                    MSG.edit({
                        embed: {
                            color: 0,
                            description: "LEVEL " + lvl
                        }
                    })
                }, 500);
                setTimeout(() => {
                    level(lvl)
                }, 3000);
            }
        }

        console.log(x + " " + y)

        //}

    }



}

function SetColor(color, time, desc) {

    //if (!InLevel) {
    console.log("color " + desc)
    MSG.edit({
        embed: {
            color: color,
            description: desc
        }
    })

    setTimeout(() => {
        MSG.edit({
            embed: {
                color: 0,
                description: desc
            }
        })
        console.log("colorCut " + desc)
    }, time - 200);
    //}

}

function level(i) {
    LvlColors = []
    /*var x = setInterval(() => {
        var n = rd()
        if (!InLevel) {
            SetColor(colors[n], 2200, "LEVEL " + i)
            console.log("!InLevel")
        }
        LvlColors[LvlColors.length] = n
        console.log(LvlColors)
    }, 2200);

    setTimeout(() => {
        clearInterval(x)
        //MSG.edit({
        //    embed: {
        //        color: 0,
        //        description: "<-- A TOI"
        //    }
        //})
        SetColor(0, 500, "<-- A TOI3 ")

        console.log("a toi")
        InLevel = true
    }, 2200 * i + 500);*/


    var m = 0
    B()
    function B() {
        if (m < i) {
            m++
            var n = rd()
            //if (!InLevel) {
            SetColor(colors[n], 2200, "LEVEL " + i)
            //}
            LvlColors[LvlColors.length] = n
            console.log(LvlColors)
            setTimeout(B, 2200)

        } else {
            MSG.edit({
                embed: {
                    color: 0,
                    description: "<-- A TOI"
                }
            })
            //level = true
            //level(lvl)
            InLevel = true
        }
    }



}




function rd(min = 0, max = 3) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}



var setParam = function (Mclient) {
    client = Mclient
}

exports.message = message
exports.messageReactionAdd = messageReactionAdd
exports.setParam = setParam
