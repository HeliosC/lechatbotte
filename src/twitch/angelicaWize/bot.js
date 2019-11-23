const tmi = require('tmi.js');

const tmiConfig = require("./config");

const poulpita = "poulpita"

var deceit = false

function startBot() {
    let client = new tmi.client(tmiConfig);
    client.connect().then((server, port) => {
        console.log(`${tmiConfig.identity.username} logged in on twitch !`)
    });

    client.on('chat', (channel, user, message, isSelf) => {
        if(isSelf){ return; }

        let m = message.toLowerCase()

        if(/(\s|^)pardon(\s|$)/gmi.test(m) && !(/(oh|ho|o) pardon/gmi.test(m))){
            client.say(channel, "Oh pardon*!")
            client.whisper("heliosdesbois", m)
        }

        if(/prout/gmi.test(m)){
            client.say(channel, "PROUT !")
        }

        if(m.startsWith("!deceit") && !deceit){
            client.say(channel, "DISSITE !")
            deceit = true
            setTimeout(function() { deceit = false }, 10000);
        }    
    })
}

module.exports.start = startBot;
