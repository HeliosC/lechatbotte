const tmi = require('tmi.js')

const tmiConfig = require("./config")

const request = require('request')

var redis = require('redis').createClient(process.env.REDIS_URL);
redis.on('connect', function () {
    console.log('connected');
});

const hdb = "heliosdesbois"
const krao = "kraoki"
const ete = 2

function chatlog(username, message) {
    let redisDate = dateFull()
    let redisDateInv = redisDate.substr(6,4)+redisDate.substr(2,4)+redisDate.substr(0,2)
    let chatredis = 'chatkraoki' + '/' + redisDateInv

    redis.exists(chatredis, function (err, reply) {
        if (reply === 1) {

            redis.get(chatredis, function (err, reply) {
                redis.set(chatredis, reply + "\n"
                    + heureOnly() + ' [' + username + '] : ' + message);
            });

        } else {
            redis.set(chatredis, "******************************** " + 'Chat du ' + redisDate + " ********************************" + "\n"
                + heureOnly() + ' [' + username + '] : ' + message);
        }
    });
}


function startBot() {




    let client = new tmi.client(tmiConfig);
    client.connect().then(_ => {
        console.log(`${tmiConfig.identity.username} logged in on twitch !`)
    }).catch(console.error);

    /* bot variables */
    //var massacres = 0;

    client.on("whisper", function (from, userstate, message, self) {

        if (self) return;

        if (m.startsWith("sayk ") && userstate['display-name'].toLowerCase() == hdb) {
            client.say(krao, message.substr(5));
        }
    }

    client.on("whisper", function (from, userstate, message, self) {
        if (self) return;

        let m = message.toLowerCase()

    });

    client.on('chat', (channel, user, message, isSelf) => {
        if (isSelf) return;

        chatlog(user.username, message)

        let m = message.toLowerCase()

        /* Specific to kraoki's channel */
        if (channel.indexOf("kraoki") != -1) {

            if (m.startsWith("arretez")) {
                console.log(channel)
                request('https://tmi.twitch.tv/group/user/'+channel.slice(1)+'/chatters', function (error, response, body) {
                    if (!error && response.statusCode == 200) {
                        let data = JSON.parse(body)
                        let viewers = Object.values(data.chatters).reduce((accumulator, array) => accumulator.concat(array), [])
                        let words = message.split(" ")
                        if(words.length > 0 ){
                            let word = words[1]
                            if( user.username == "heliosdesbois" || (word.toLowerCase()!="policenationaleduswag" && word.toLowerCase()!="policedesbois" && word.toLowerCase()!="heliosdesbois" && viewers.indexOf(word.toLowerCase())!=-1) ){
                                client.say(channel, word + ", vous êtes en état d'arrestation !");
                            }
                        }
                    } else {
                        console.error("unable ")
                    }
                })
            }


        }
    });
}

// function isModerateur(username) {
//     return moderators.indexOf(username.toLowerCase()) != -1;
// }

function heureOnly() {
    let date = new Date();
    let heure = date.getHours() + ete;
    let minutes = date.getMinutes();
    if (heure < 10) {
        heure = "0" + heure;
    }
    if (minutes < 10) {
        minutes = "0" + minutes;
    }

    return (heure) + ":" + minutes
}

function dateFull() {
    let date = new Date();
    let month = date.getMonth() + 1;
    let jour = date.getDate();
    if (jour < 10) {
        jour = "0" + jour;
    }
    if (month < 10) {
        month = "0" + month;
    }

    return jour + '/' + month + '/' + date.getFullYear()
}

module.exports.start = startBot;
