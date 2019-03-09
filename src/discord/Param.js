const Queue = require('./actions/Queue.js');
const BotReactions = require('./actions/BotReactions.js');
const Role = require('./actions/Roles.js');

const Connect4 = require('./games/Connect4.js');
const Quiz = require('./games/Quiz.js');
const Test = require('./games/Test.js');
const Simon = require('./games/Simon.js');
const Mdp = require('./games/Motdepasse.js');


const chanIm = "images_videos_trop_lentes";
const chanCh = "cest_ta_vie";
const chanQ = "attente";
const chanJeux = "jeux";
const chanQuiz = "quiz";
const chanRole = "rôle";
const chanMdp = "mot_de_passe";

const nombot = "Le Chat Botté";

const nomdon = "Chats de qualité supérieure 🐱 (donateurs)"; // "🐱Chats de qualité supérieure"
const nomsub = "PUTAIN DE CHATONS 💕 (subs)"; //"💕PUTAIN DE CHATONS"
const nommodo = "Chats sous chef 🐾"; //"🐾Chats sous chef"
const nomadmin = "Le Chat en chef 🦄"; //"🦄Le Chat en chef"

const tagS = "²";


var message = function (msg) {
    if (msg.channel.type != "text") { return }

    Queue.message(msg);
    BotReactions.message(msg);
    Connect4.message(msg);
    Quiz.message(msg);
    Test.message(msg);
    Simon.message(msg);
    Role.message(msg);
    Mdp.message(msg);
}

var messageReactionAdd = function (reaction, user) {
    Connect4.messageReactionAdd(reaction, user);
    Quiz.messageReactionAdd(reaction, user);
    Simon.messageReactionAdd(reaction, user);
    Mdp.messageReactionAdd(reaction, user);
}

var setParam = function (client) {
    BotReactions.setParam(chanIm, chanCh, nombot, nomadmin, nommodo, nomsub, nomdon, client, tagS);
    Queue.setParam(chanQ, nomadmin, nommodo);
    Connect4.setParam(client, chanJeux, nomadmin, nommodo);
    Quiz.setParam(client, chanQuiz, nomadmin, nommodo);
    Test.setParam(client);
    //Simon.setParam(client);
    Role.setParam(client, chanRole, nomadmin, nommodo);
    Mdp.setParam(client, chanMdp);
}

exports.message = message;
exports.messageReactionAdd = messageReactionAdd;
exports.setParam = setParam;
