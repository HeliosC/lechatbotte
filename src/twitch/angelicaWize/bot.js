const tmi = require('tmi.js');

const tmiConfig = require("./config");

const poulpita = "poulpita"
const hdb = "heliosdesbois"

var deceit = false

var redis

function startBot(redisClient) {

    redis = redisClient

    let client = new tmi.client(tmiConfig);
    client.connect().then((server, port) => {
        console.log(`${tmiConfig.identity.username} logged in on twitch !`)
    });

    client.on('chat', (channel, user, message, isSelf) => {
        if(isSelf){ return; }

        let m = message.toLowerCase()

        if(/(\s|^)pardon(\s|$)/gmi.test(m) && !(/(oh|ho|o) pardon/gmi.test(m))){
            client.say(channel, "Oh pardon*!")
            client.whisper("heliosdesbois", m)
        }

        if(/p+r+o+u+t+/gmi.test(m)){
            client.say(channel, "PROUT !")
        }

        if(m.startsWith("!deceit") && !deceit){
            client.say(channel, "DISSITE !")
            deceit = true
            setTimeout(function() { deceit = false }, 10000);
        }    

    })


    client.on("whisper", function (from, user, message, self) {

        if (self) return;

        let m = message.toLowerCase()
        let username = user.username;

        let isMod = user.mod || user['user-type'] === 'mod';
        let isBroadcaster = username.toLowerCase === "poulpita";
        let isHelios = username.toLowerCase() === "heliosdesbois";
        let isModUp = isMod || isBroadcaster || isHelios;

        var args = message.split(" ")
        if(isModUp && args.length>4){
            if(args[0] == "!question"){
                var questRep = args.splice(2).join(" ").split(" *** ")
                var question = questRep[0]
                var reponse = questRep[1]
                console.log("question : "+question+" / reponse : "+reponse)
                client.say(poulpita, "question : "+question+" / reponse : "+reponse)

                switch (args[1]){
                    case "add":
                    console.log("add")
                        redis.hexists("poulpita/questions", question, (err, exists) => {
                            console.log("add ", exists)
                            if(exists){
                                client.say(poulpita, "Cette question existe déjà.")
                                //console.log("Cette question existe déjà.")
                            }else //if(args[3]!=null && args[3]!=undefined)
                            {
                                redis.hset("poulpita/questions", question, reponse, (err, reply) => {
                                    client.say(poulpita, "Question "+ question + " crée.")
                                    //console.log("Question crée.")
                                })
                            }
                        })
                        break
                    case "edit":
                        redis.hexists("poulpita/questions", question, (err, exists) => {
                            if(!exists){
                                client.say(poulpita, "Cette question n'existe pas.")
                            }else //if(args[3]!=null && args[3]!=undefined)
                            {
                                redis.hset("poulpita/questions", question, reponse, (err, reply) => {
                                    client.say(poulpita, "Question modifiée.")
                                })
                            }
                        })
                        break
                    case "remove":
                        redis.hexists("poulpita/questions", question, (err, exists) => {
                            if(!exists){
                                client.say(poulpita, "Cette question n'existe pas.")
                            }else{
                                redis.hdel("poulpita/questions", question, (err, reply) => {
                                    client.say(poulpita, "Question supprimée.")
                                })
                            }
                        })
                        break
                }
            }
        }
    })
}

module.exports.start = startBot;
