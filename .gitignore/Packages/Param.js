const Queue = require('./Queue.js');
const BotReactions = require('./BotReactions.js');
const Connect4 = require('./Connect4.js')
const Quiz = require('./Quiz.js')


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

var Pclient
var testo=false

tagS = "²"

var message = function (msg) {
    Queue.message(msg)
    BotReactions.message(msg)
    Connect4.message(msg)
    Quiz.message(msg)

    testsleep(msg)
}

var messageReactionAdd = function (reaction, user) {
    Connect4.messageReactionAdd(reaction, user)
    Quiz.messageReactionAdd(reaction, user)
}

var setParam = function (client) {
    Pclient = client
    BotReactions.setParam(chanIm, chanCh, nombot, nomadmin, nommodo, nomsub, nomdon, client, tagS)
    Queue.setParam(chanQ, nomadmin, nommodo)
    Connect4.setParam(client, chanJeux, nomadmin, nommodo)
    Quiz.setParam(client, chanQuiz, nomadmin, nommodo)
}

exports.message = message
exports.messageReactionAdd = messageReactionAdd
exports.setParam = setParam

var I = 0
function test() {
    setTimeout(() => {
        //console.log("a")
        I = I + 1
        //client.channels.find('name', "testbotquiz").send("test " + I)
        MSG.edit("test " + I)
        test()
    }, 60 * 1000);
}

function testsleep(msg) {
    if (msg.content == "***bite***" && msg.author.username == "Helios" && msg.channel.name == "testbotquiz") {
        testo = true
        msg.channel.send("test 0")
        test()
    }

    if (testo && msg.author.bot) {
        MSG = msg
        testo = false
    }
}

function testsleepauto2() {
    testo = true
    Pclient.channels.find('name', "testbotquiz").send("test 0")
    test()
}

exports.testsleepauto2 = testsleepauto2
