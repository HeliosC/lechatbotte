const tmi = require('tmi.js');

const hdb = "heliosdesbois";

const tmiConfig = require("./config");


function startBot() {
    let client = new tmi.client(tmiConfig);
    client.connect().then(_ => {
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
    client.on("subgift", (channel, username, streakMonths, recipient, methods, userstate) => {
        if(channel == "#" + cdb){
            client.say(channel, username + " chatdeLove chatdeLove chatdeLove chatdeLove chatdeLove");
        }        
    });
    client.on("submysterygift", (channel, username, numbOfSubs, methods, userstate) => {
        if(channel == "#" + cdb){
            client.say(channel, username + " chatdeLove chatdeLove chatdeLove chatdeLove chatdeLove");
        }
    });
    

}

module.exports.start = startBot;
