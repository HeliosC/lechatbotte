const tmi = require('tmi.js');

const tmiConfig = require("./config");

const poulpita = "poulpita"
const hdb = "heliosdesbois"

var deceit = false

var redis


var onQuestion = false 
var Answer = []

function startBot(redisClient) {

    redis = redisClient

    let client = new tmi.client(tmiConfig);
    client.connect().then((server, port) => {
        console.log(`${tmiConfig.identity.username} logged in on twitch !`)
    });

    client.on('chat', (channel, user, message, isSelf) => {
        if(isSelf){ return; }

        let m = message.toLowerCase()
        let username = user.username;


        if(/(\s|^)pardon(\s|$)/gmi.test(m) && !(/(oh|ho|o) pardon/gmi.test(m))){
            client.say(channel, "Oh pardon*!")
            client.whisper("heliosdesbois", m)
        }

        if(/p+r+o+u+t+/gmi.test(m)){
            redis.incr("poulpita/prout", (err, prouts) => {
                client.say(channel, "PROUT ! (" + prouts + ")")
            })
        }

        if(m.startsWith("!deceit") && !deceit){
            client.say(channel, "DISSITE !")
            deceit = true
            setTimeout(function() { deceit = false }, 10000);
        }    


        if(onQuestion){
            if(Answer.includes(m)){
                client.say(channel, "BRAVO " + username + " !")
                onQuestion = false
            }
        }

        let isMod = user.mod || user['user-type'] === 'mod';
        let isBroadcaster = username.toLowerCase === "poulpita";
        let isHelios = username.toLowerCase() === "heliosdesbois";
        let isModUp = isMod || isBroadcaster || isHelios;

        var args = m.split(" ")
        if(isModUp){
            if(args[0] == "!question"){
                if(args.length == 1){
                    //donner une question random
                    redis.hgetall("poulpita/questions", (err, questions) => {
                        nq = randInt(Object.keys(questions).length)
                        client.say(channel, Object.keys(questions)[nq])
                        Answer = Object.values(questions)[nq].toLowerCase().split("+")
                        onQuestion = true
                        setTimeout(() => {questionTimeout(channel)}, 10000);
                    })
                }else if(args.length == 2 && args[1]!="list"){
                    //donner cette question
                    nq = parseInt(args[1]) || 0;
                    if(nq>0){
                        redis.hgetall("poulpita/questions", (err, questions) => {
                            if(nq<=Object.keys(questions).length){
                                client.say(channel, Object.keys(questions)[nq-1])
                                Answer = Object.values(questions)[nq-1].toLowerCase().split("+")
                                console.log(Answer)
                                onQuestion = true
                                setTimeout(() => {questionTimeout(channel)}, 10000);
                            }
                        })
                    }
                }
            }
        }

    })


    client.on("whisper", function (from, user, message, self) {

        //return
        if (self) return;


    })
    
    
    function questionTimeout(channel){
        if(onQuestion){
            onQuestion = false
            client.say(channel, "Time's up ! Il fallait répondre : "+Answer.join(", "))
        }
    }


}


function randInt(length){
    return Math.floor(Math.random()*length)
}


module.exports.start = startBot;
