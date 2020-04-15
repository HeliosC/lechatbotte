const tmi = require('tmi.js')

const tmiConfig = require("./config")

// const request = require('request')

var redis = require('redis').createClient(process.env.REDIS_URL);
redis.on('connect', function () {
    console.log('connected');
});

const hdb = "heliosdesbois"
const kahchi = "melkahchi"
const ete = 2

const moderators = ["heliosdesbois", "pioudesbois", "malikahchi"]

rotsON = true

function startBot() {
    let client = new tmi.client(tmiConfig);
    client.connect().then(_ => {
        console.log(`${tmiConfig.identity.username} logged in on twitch !`)
    }).catch(console.error);

    client.on("whisper", function (from, userstate, message, self) {
        if (self) return;

        let m = message.toLowerCase()

        if (m.startsWith("saykahchi ") && userstate['display-name'].toLowerCase() == hdb) {
            client.say(krao, message.substr(10));
        }
    });

    client.on('chat', (channel, user, message, isSelf) => {
        if (isSelf) return;

        let m = message.toLowerCase()

        /* Specific to kraoki's channel */
        if (/malphite/gmi.test(m)) { //*rots -> affiche le nb
            client.say(channel, "BOOM, j'te soulève " + user['display-name'] + " !");
        }

        if (/^!ro|ôt?\s?\+\s?1$/gmi.test(m) && rotsON) { //*rot -> incremente
            rotsON = false
            setTimeout(function () {
                rotsON = true
            }, 15000); 
            
            redis.incr('melikahchi/rots', function (err, reply) {
                afficheRots(client, channel, parseInt(reply));
            });
    
        } else if (/^!ro|ôts?$/gmi.test(m)) { //*rots -> affiche le nb
            redis.get('melikahchi/rots', function (err, reply) {
                afficheRots(client, channel, parseInt(reply));
            });
    
        } else if (isModerateur(user.username) && /^!ro|ôts?\s?\-\s?1$/gmi.test(m)) {
            redis.decr('melikahchi/rots', function (err, reply) {
                afficheRots(client, channel, parseInt(reply));
            });
        }
        else if (isModerateur(user.username) && /^!ro|ôts \d/gmi.test(m)) {
            rots = parseInt(m.slice(4 + 1)) || 0;
            if(rots != 0){
                afficheRots(client, channel, rots);
                redis.set('melikahchi/rots', rots);
            }
        }




    });
}

function afficheRots(client, channel, rots) {
    client.say(
        channel,
        `Kahchi a blurp ${rots} fois`
    );
}

function isModerateur(username) {
    return moderators.indexOf(username.toLowerCase()) != -1;
}

module.exports.start = startBot;
