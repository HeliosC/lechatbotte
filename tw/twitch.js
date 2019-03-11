const tmi = require('tmi.js')
const pseudos = require('./pseudos.js');

const tmiConfig = {
    options: {
        debug: true
    },
    connection: {
        reconnect:  true
    },
    identity: {
        username: "PoliceDesBois",
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
    if (m.indexOf("pain au chocolat") != -1) {
        client.say(channel, user['display-name']+" Chocolatine*");
    }
    //let regex = /\s?sa\s?va/gmi
    if (/(^|\W)(je|tu)\speu($|\W|t)/gmi.test(m)) {           //   je/tu peux
        client.say(channel, user['display-name']+" peuX");
    }
    if (/(^|\W)on\speu($|\W|x)/gmi.test(m)) {               //   on peut
        client.say(channel, user['display-name']+" peuT");
    }
    if (/(^|\W)(je|tu)\sveu($|\W|t)/gmi.test(m)) {          //   je/tu veux
        client.say(channel, user['display-name']+" veuX");
    }
    if (/(^|\W)on\sveu($|\W|x)/gmi.test(m)) {               //   on veut
        client.say(channel, user['display-name']+" veuT");
    }
    if (/(^|\W)sa\s?va($|\W)/gmi.test(m)) {                 // sava
        client.say(channel, user['display-name']+" ça va*");
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




////////////////MASSACRES//////////////////////////////////////////////////
massacres = 0

client.on('chat', (channel, user, message, isSelf) => {

    if (isSelf) return;

    m=message.toLowerCase()

    //     if (/(^|\W)sa\s?va($|\W)/gmi.test(m)) {

    if (/^\!massacre+1$/gmi.test(m)) { //*massacre -> incremente
        massacres+=1
        afficheMassacres()
    }
    if (/^\!massacre$/gmi.test(m)) { //*massacres -> affiche le nb
        afficheMassacres()
    }
    
});

function afficheMassacres(){
    client.say(cdb, "Chatdesbois a massacré "+massacres+
    " pseudo"+"s".repeat(massacres>1)+" en toute impunité");
}

client.on("whisper", function (from, userstate, message, self) {

    if (self) return;

    m=message.toLowerCase()

    if(m.startsWith("massacres") && mods.indexOf(userstate['display-name'].toLowerCase())!=-1){
        massacres=m.substr(10)
        afficheMassacres()
    }
});
//////////////////////////////////////////////////////////////////







function heure()
{
     var date = new Date();
     var heure = date.getHours();
     var minutes = date.getMinutes();
     if(minutes < 10)
          minutes = "0" + minutes;
     return date.getDate() +":"+ date.getMonth()+ " "+ heure + "h" + minutes;
}