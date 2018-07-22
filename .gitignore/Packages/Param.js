const Queue = require('./Queue.js');
const BotReactions = require('./BotReactions.js');
const Connect4 = require('./Connect4.js')
const Quiz = require('./Quiz.js')
const Test = require('./Test.js')
const Simon = require('./Simon.js')
//const Shifumi = require('./Shifumi.js')
const Role = require('./Roles.js')


const chanIm = "images_videos_trop_lentes"
const chanCh = "cest_ta_vie"
const chanQ = "attente"
const chanJeux = "jeux"
const chanQuiz = "quiz"
const chanRole = "rôle"

const nombot = "Le Chat Botté"

const nomdon = "🐱Chats de qualité supérieure"
const nomsub = "💕PUTAIN DE CHATONS"
const nommodo = "🐾Chats sous chef"
const nomadmin = "🦄Le Chat en chef"

tagS = "²"

var message = function (msg) {
    Queue.message(msg)
    BotReactions.message(msg)
    Connect4.message(msg)
    Quiz.message(msg)
    Test.message(msg)
    Simon.message(msg)
    //Shifumi.message(msg)
    Role.message(msg)
}

var messageReactionAdd = function (reaction, user) {
    Connect4.messageReactionAdd(reaction, user)
    Quiz.messageReactionAdd(reaction, user)
    Simon.messageReactionAdd(reaction, user)
    //Shifumi.messageReactionAdd(reaction, user)
}

var setParam = function (client) {
    BotReactions.setParam(chanIm, chanCh, nombot, nomadmin, nommodo, nomsub, nomdon, client, tagS)
    Queue.setParam(chanQ, nomadmin, nommodo)
    Connect4.setParam(client, chanJeux, nomadmin, nommodo)
    Quiz.setParam(client, chanQuiz, nomadmin, nommodo)
    Test.setParam(client)
    Simon.setParam(client)
    //Shifumi.setParam(client, chanJeux, nomadmin, nommodo)
    Role.setParam(client, chanRole, nomadmin, nommodo)

    setTimeout(Test.testsleepauto, 60 * 1000)
}

exports.message = message
exports.messageReactionAdd = messageReactionAdd
exports.setParam = setParam

/*
var I = 1
function test() {
    setTimeout(() => {
        //console.log("a")
        I = I + 1
        //client.channels.find('name', "testbotquiz").send("test " + I)
        MSG.edit("last deploy : " + Math.trunc(I/60) + " h " + I%60)
        test()
    }, 60 * 1000);
}

function testsleep(msg) {
    if (msg.content == "***bite***" && msg.author.username == "Helios" && msg.channel.name == "testbotquiz") {
        testo = true
        msg.channel.send("last deploy : 0 h 1")
    }

    if (testo && msg.author.bot) {
        MSG = msg
        testo = false
        test()
    }
}

function testsleepauto2() {
    testo = true
    Pclient.channels.find('name', "testbotquiz").send("last deploy : 0 h 1")
    //test()
}

exports.testsleepauto2 = testsleepauto2*/
