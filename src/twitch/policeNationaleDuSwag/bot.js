const tmi = require('tmi.js')

const tmiConfig = require("./config")

const cdb = "chatdesbois"
const hdb = "heliosdesbois"

const mods = ["heliosdesbois", "pouidesbois", "chatdesbois", "solis_the_sun"]


function startBot() {
    let client = new tmi.client(tmiConfig);
    client.connect().then(_ => {
        client.whisper(hdb, "Deployed: " + heure());
    });

    client.on("whisper", function (from, userstate, message, self) {
        if (self) return;

        let m = message.toLowerCase()

        if (m.startsWith("zboub") && mods.indexOf(userstate['display-name'].toLowerCase()) != -1) {
            client.say(hdb, "Sachez que j'adore le zboub")
        }

        if (m.startsWith("say ") && userstate['display-name'].toLowerCase() == hdb) {
            client.say(cdb, m.substr(4));
        }

        if (m.startsWith("sayh ") && userstate['display-name'].toLowerCase() == hdb) {
            client.say(hdb, m.substr(5));
        }
    });

    client.on('chat', (channel, user, message, isSelf) => {
        console.log(channel)

        if (isSelf) return;

        let m = message.toLowerCase()

        // if (m.startsWith("arretez")) {
        //     let words = message.split(" ")
        //     client.say(channel, words[1] + ", vous êtes en état d'arrestation !");
        // }

        if (m.indexOf("je peut") != -1 || m.indexOf("tu peut") != -1) {// || m.indexOf("je peu")!=-1 || m.indexOf("tu peu")!=-1){
            client.say(channel, user['display-name'] + " peuX");
        }

        if (m.indexOf("on peux") != -1){
            client.say(channel, user['display-name'] + " peuT");
        }
    });
}

function heure() {
    let date = new Date();
    let heure = date.getHours();
    let minutes = date.getMinutes();
    if (minutes < 10) {
        minutes = "0" + minutes;
    }
    return date.getDate() + ":" + date.getMonth() + " " + heure + "h" + minutes;
}


module.exports.start = startBot;
