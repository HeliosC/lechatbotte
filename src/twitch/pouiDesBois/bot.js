const tmi = require('tmi.js');

const tmiConfig = require("./config");

const cdb = "chatdesbois"
const hdb = "heliosdesbois"

function startBot() {
    let client = new tmi.client(tmiConfig);
    client.connect().then((server, port) => {
        console.log(`${tmiConfig.identity.username} logged in on twitch !`)
    });


    client.on("subscription", (channel, username, method, message, userstate) => {
        if(channel == "#" + cdb){
            client.say(channel, username + " chatdeLove chatdeLove chatdeLove chatdeLove chatdeLove");
        }
    });

    client.on("resub", (channel, username, months, message, userstate, methods) => {
        if(channel == "#" + cdb){
            client.say(channel, username + " chatdeLove chatdeLove chatdeLove chatdeLove chatdeLove");
        }
    });
}

module.exports.start = startBot;
