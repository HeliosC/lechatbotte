const tmi = require('tmi.js')

const tmiConfig = require("./config")

var redis = require('redis').createClient(process.env.REDIS_URL);
redis.on('connect', function() {
    console.log('connected');
});

//redis.set('massacres', 0);


// redis.get('key', function(err, reply) {
//     console.log(reply); // "value"
// });

const cdb = "chatdesbois"
const hdb = "heliosdesbois"

const moderators = ["heliosdesbois", "pouidesbois", "chatdesbois", "solis_the_sun"]


function startBot() {
    let client = new tmi.client(tmiConfig);
    client.connect().then(_ => {
        console.log(`${tmiConfig.identity.username} logged in on twitch !`)
        client.whisper(hdb, "Deployed: " + heure());
    }).catch(console.error);

    /* bot variables */
    //var massacres = 0;


    client.on("whisper", function (from, userstate, message, self) {
        if (self) return;

        let m = message.toLowerCase()

        if (m.startsWith("zboub") && moderators.indexOf(userstate['display-name'].toLowerCase()) != -1) {
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
        if (isSelf) return;

        let m = message.toLowerCase()

        // if (m.startsWith("arretez")) {
        //     let words = message.split(" ")
        //     client.say(channel, words[1] + ", vous êtes en état d'arrestation !");
        // }

        if (/(^|\W)(je|tu)\speu($|\W|t)/gmi.test(m)) {           //   je/tu peux
            client.say(channel, user['display-name'] + " peuX");
        }
        if (/(^|\W)on\speu($|\W|x)/gmi.test(m)) {               //   on peut
            client.say(channel, user['display-name'] + " peuT");
        }
        if (/(^|\W)(je|tu)\sveu($|\W|t)/gmi.test(m)) {          //   je/tu veux
            client.say(channel, user['display-name'] + " veuX");
        }
        if (/(^|\W)on\sveu($|\W|x)/gmi.test(m)) {               //   on veut
            client.say(channel, user['display-name'] + " veuT");
        }
        if (/(^|\W)sa\s?va($|\W)/gmi.test(m)) {                 //   sava
            client.say(channel, user['display-name'] + " ça va*");
        }

        /* Specific to chatDesBois's channel */
        if (channel.indexOf(cdb) != -1) {
            if (/^!massacres\+1$/gmi.test(m)) { //*massacre -> incremente
                //massacres += 1;
                redis.get('massacres', function(err, reply) {
                    afficheMassacres(client, channel, parseInt(reply)+1);
                    redis.set('massacres', parseInt(reply)+1);
                });

            } else if (/^!massacres$/gmi.test(m)) { //*massacres -> affiche le nb
                redis.get('massacres', function(err, reply) {
                    afficheMassacres(client, channel, parseInt(reply));
                });

            }else if (isModerateur(user.username) && /^!massacres \d/gmi.test(m)) {
                massacres = parseInt(m.slice(9)) || 0;
                afficheMassacres(client, channel, massacres);
                redis.set('massacres', massacres);
            }
        }
    });
}


function isModerateur(username) {
    return moderators.indexOf(username.toLowerCase()) != -1;
}

function afficheMassacres(client, channel, massacres) {
    client.say(
        channel,
        `Chatdesbois a massacré ${massacres} pseudo${massacres > 1 ? "s" : ""} en toute impunité`
    );

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
