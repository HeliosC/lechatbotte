const tmi = require('tmi.js')

const tmiConfig = {
    options: {
        debug: true
    },
    connection: {
        reconnect:  true
    },
    identity: {
        username: "PoliceNationaleDuSwag",
        password: process.env.police
    },
    channels: [
        "heliosdesbois",
        "kraoki",
        "chatdesbois"
        //"TeamLDLC"
    ]
};
let client = new tmi.client(tmiConfig);
client.connect();

const tmiConfig2 = {
    options: {
        debug: true
    },
    connection: {
        reconnect:  true
    },
    identity: {
        username: "HeliosDesBois",
        password: process.env.helios
    },
    channels: [
        "heliosdesbois",
        "kraoki",
        "chatdesbois",
        //"TeamLDLC"
    ]
};
let client2 = new tmi.client(tmiConfig2);
client2.connect().then(_ => {
    client.whisper(hdb, "Deployed: " + heure());
});

// setTimeout(function(){ 
//     client.whisper(hdb, "Deployed : "+heure());
// }, 5000);

cdb = "chatdesbois"
hdb = "heliosdesbois"

mods=["heliosdesbois","pouidesbois","chatdesbois","solis_the_sun"]

// client2.whisper(hdb, "Deployed");

client.on("whisper", function (from, userstate, message, self) {

    m=message.toLowerCase()

    if(message.toLowerCase().startsWith("zboub") && mods.indexOf(userstate['display-name'].toLowerCase())!=-1){
        client.say(hdb, "Sachez que j'adore le zboub")
        client2.say(hdb, "Sachez que j'adore le zboub")
    }

    if(message.toLowerCase().startsWith("say ") && userstate['display-name'].toLowerCase() == hdb ){
        client.say(cdb, m.substr(4));
    }
    if(message.toLowerCase().startsWith("sayh ") && userstate['display-name'].toLowerCase() == hdb ){
        client.say(hdb, m.substr(5));
    }


    if (self) return;

});


client.on('chat', (channel, user, message, isSelf) => {
    console.log(channel)
    if (isSelf) return;

    m=message.toLowerCase()

    if(m.startsWith("arretez")&&0){
        let words = message.split(" ")
        client.say(channel, words[1]+", vous êtes en état d'arrestation !");
    }
    if(m.indexOf("je peut")!=-1 || m.indexOf("tu peut")!=-1){// || m.indexOf("je peu")!=-1 || m.indexOf("tu peu")!=-1){
        client.say(channel, user['display-name']+" peuX");
    }
    if(m.indexOf("on peux")!=-1){
        client.say(channel, user['display-name']+" peuT");
    }

});

client2.on("subscription", (channel, username, method, message, userstate) => {
    if(channel == "#"+cdb && username!=hdb){
        client2.say(channel, username+" chatdeLove chatdeLove chatdeLove chatdeLove chatdeLove")
    }
});
client2.on("resub", (channel, username, months, message, userstate, methods) => {
    if(channel == "#"+cdb && username!=hdb){
        client2.say(channel, username+" chatdeLove chatdeLove chatdeLove chatdeLove chatdeLove")
    }
});











function heure()
{
     var date = new Date();
     var heure = date.getHours();
     var minutes = date.getMinutes();
     if(minutes < 10)
          minutes = "0" + minutes;
     return date.getDate() +":"+ date.getMonth()+ " "+ heure + "h" + minutes;
}