

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
        password: "oauth:o72g2bb4savfz9abjlr557opbb9n0g"
    },
    channels: [
        "heliosdesbois",
        "kraoki",
        "chatdesbois",
        //"TeamLDLC"
    ]
};

const tmiConfig2 = {
    options: {
        debug: true
    },
    connection: {
        reconnect:  true
    },
    identity: {
        username: "HeliosDesBois",
        password: "oauth:iby8ruh56ztbd2awu0nm9nvf7pi8ct"
    },
    channels: [
        "heliosdesbois",
        "kraoki",
        "chatdesbois",
        //"TeamLDLC"
    ]
};

cdb = "chatdesbois"
hdb = "heliosdesbois"

mods=["heliosdesbois","pouidesbois","chatdesbois","solis_the_sun"]

let client = new tmi.client(tmiConfig);
let client2 = new tmi.client(tmiConfig2);

client.connect();
client2.connect();

// client.on('connected', (adress, port) => {
//     console.log(client.getUsername() + " s'est connecté sur : " + adress + ", port : " + port);
//     client.say(channel,"Kraoki, vous êtes en état d'arrestation !");
// });



client.on("whisper", function (from, userstate, message, self) {

    m=message.toLowerCase()

    if(message.toLowerCase().startsWith("zboub") && mods.indexOf(userstate['display-name'].toLowerCase())!=-1){
        client.say(hdb, "Sachez que j'adore le zboub")
        client2.say(hdb, "Sachez que j'adore le zboub")

        console.log(userstate['display-name'])
        console.log( mods.indexOf(userstate['display-name'].toLowerCase())!=-1 )


        // console.log("test")
        // //console.log(userstate)
        //console.log(""+client.isMod("#heliosdesbois", "HeliosDesBois"))

        // console.log(client.getChannels())

    }


    if (self) return;

});


client.on('chat', (channel, user, message, isSelf) => {
    if (isSelf) return;

    m=message.toLowerCase()

    if(message.toLowerCase().startsWith("arretez")){
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

//user['display-name']

//pas f, mais lol ow brite

exports.cons = cons