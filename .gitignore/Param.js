const Queue = require('./Queue.js');
const BotReactions = require('./BotReactions.js');
const Connect4 = require('./Connect4.js')


const chanIm = "images_videos_trop_lentes"
const chanCh = "cest_ta_vie"
const chanQ = "attente"
const chanJeux = "jeux"

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
}

var messageReactionAdd = function (reaction, user) {
    Connect4.messageReactionAdd(reaction, user)
}

var setParam = function (client) {
    BotReactions.setParam(chanIm, chanCh, nombot, nomadmin, nommodo, nomsub, nomdon, client, tagS)
    Queue.setParam(chanQ, nomadmin, nommodo)
    Connect4.setParam(client, chanJeux, nomadmin, nommodo)
}

exports.message = message
exports.messageReactionAdd = messageReactionAdd
exports.setParam = setParam
