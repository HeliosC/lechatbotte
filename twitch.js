

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
client2.connect();

cdb = "chatdesbois"
hdb = "heliosdesbois"

mods=["heliosdesbois","pouidesbois","chatdesbois","solis_the_sun"]



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

client2.on("subscription", (channel, username, method, message, userstate) => {
    // Do your stuff.
    if(channel == "#"+cdb){
        client2.say(channel, username+" chatdeLove chatdeLove chatdeLove chatdeLove chatdeLove")
    }
});

client2.on("resub", (channel, username, months, message, userstate, methods) => {
    // Do your stuff.
    //let cumulativeMonths = ~~userstate["msg-param-cumulative-months"];
    if(channel == "#"+cdb){
        client2.say(channel, username+" chatdeLove chatdeLove chatdeLove chatdeLove chatdeLove")
    }
});

//user['display-name']

//pas f, mais lol ow brite

