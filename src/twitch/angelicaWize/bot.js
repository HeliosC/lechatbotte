const tmi = require('tmi.js');

const tmiConfig = require("./config");

var api = require('twitch-api-v5')
api.clientID = process.env.clientID

const poulpita = "poulpita"
const hdb = "heliosdesbois"
const idpoulpita = "204501281"

var deceit = false

var redis
var isCached = {}
var qTO

var questionOn = false
var QPUP = true

var active = "false"
var onQuestion = false 
var Answer = []
var AnswerFlat = []
var question

const nbQuestionsMessages = 30
const minQuestionsMessages = 6
const maxQuestionsMessages = 10

function chatlog(username, message) {
    let redisDate = dateFull()
    let redisDateInv = redisDate.substr(6,4)+redisDate.substr(2,4)+redisDate.substr(0,2)
    let chatredis = 'chatpoulpita' + '/' + redisDateInv

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

function startBot(redisClient) {

    redis = redisClient
    let client = new tmi.client(tmiConfig);
    client.connect();

    api.streams.channel({ channelID: idpoulpita }, (err, res) => {
        if(!err) {
            //Live on ???
            console.log("RESTART LIVE POULPI ?")
            if ( (res.stream != null)) {
                console.log("LIVE POULPI ONNNNNNNNNNNNNNNNNNNN")
                questionsAuto("#"+res.stream.channel.name)
                active = "true"
                intervalObject = setInterval(()=>{
                    checkLiveOff(client)
                }, 300*60000);

            }else{
                active = "false"
                redis.del("poulpita/questions/cache")
                console.log("LIVE POULPI OFFFFFFFFFFFFFFFFF")
            }
        }
    })

    client.on('chat', (channel, user, message, isSelf) => {
        chatlog(user.username, message)
        if(isSelf){
            return;
        }
        if(active=="false"){
            api.streams.channel({ channelID: idpoulpita }, (err, res) => {
                if(!err) {
                    //Live on ???
                    if ( (res.stream != null)) {
                        console.log("LIVE POULPI ONNNNNNNNNNNNNNNNNNNN")
                        redis.incr("poulpita/QuestionsMessages")
                        questionsAuto("#"+res.stream.channel.name)
                        active = "true"
                        intervalObject = setInterval(()=>{
                            checkLiveOff(client)
                        }, 300*60000);
                    }
                }
            })
        }else{
            redis.incr("poulpita/QuestionsMessages")
        }
        let m = message.toLowerCase()
        let username = user.username;
        let displayname = user['display-name'];
        let userid = user['user-id']

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

        if(userid!=undefined){
            if(isCached[userid]!=true){
                isCached[userid]=true
                api.users.userByID({ userID: userid }, (err, res) => {
                    if(!err) {
                        redis.hset('ranking/logo', userid, res.logo)
                        redis.hset('ranking/username', userid, displayname)
                        redis.hset('ranking/color', userid, user.color)
                        redis.hset('ranking/id', username, userid)
                    }
                })
            }
        }

        if(m.startsWith("!rank")){
            if(questionOn){                
                redis.zrevrange("poulpita/rank", 0, -1, 'WITHSCORES', (err, scores) => {
                    getUserScores(scores).then( (UserScores) => {
                        ranking = ""
                        rank = 1
                        idboo = true
                        UserScores.forEach(score => {
                            if(idboo){
                                if(rank!=1){
                                    ranking = ranking + " - "
                                }
                                ranking= ranking + rank + ")"+score+ ":"
                                rank+=1
                            }else{
                                ranking= ranking + score// + " - "
                            }
                            idboo = !idboo
                        })
                        client.say(channel, ranking)
                    })
                })
            }
        }

        function getUserScores(scores){
            var promises = []
            idboo = true
            scores.forEach(element => {
                if(idboo){
                    promises.push(getUserbyID(element))
                }else{
                    promises.push(element)
                }
                idboo = !idboo
            })
            return Promise.all(promises).then(s => {
                return s
            })
        }

        function getUserbyID(id){
            return new Promise(function(resolve, reject){
                redis.hget('ranking/username', id, (err, username) => {
                    resolve(username)
                })
            })
        }

        if(onQuestion){
            mflat = m.flat()
                for(var i= 0; i < AnswerFlat.length; i++){
                    var regex = new RegExp("^"+AnswerFlat[i]+"$", "gi")
                  if(regex.test(mflat)){
                      onQuestion = false
                      client.say(channel, "BRAVO " + displayname + " !")
                      clearTimeout(qTO)
                      redis.lpush("poulpita/questions/cache", question)
                      if(QPUP){
                          redis.zincrby("poulpita/rank", 1, userid)
                      }
                      return
                  }
            }
        }

        let isMod = user.mod || user['user-type'] === 'mod';
        let isBroadcaster = username.toLowerCase() === "poulpita";
        let isHelios = username.toLowerCase() === "heliosdesbois";
        let isModUp = isMod || isBroadcaster || isHelios;

        var args = m.split(" ")
        if(isModUp && !onQuestion && questionOn){
            if(args[0] == "!question"){
                if(args.length == 1){
                    //donner une question random
                    redis.hgetall("poulpita/questions", (err, questions) => {
                        redis.lrange("poulpita/questions/cache", -100, 100, (err, cachedquestions) => {
                            do{
                                nq = randInt(Object.keys(questions).length)
                                question = Object.keys(questions)[nq]
                                console.log("question : "+question)
                            }while(cachedquestions.includes(question))
                            client.say(channel, question)
                            Answer = Object.values(questions)[nq].toLowerCase().split("&")
                            answerFlatter()
                            onQuestion = true
                            qTO = setTimeout(() => {questionTimeout(channel)}, 60000);
                        })
                    })
                }else if(args.length == 2 && args[1]!="list"){
                    //donner cette question
                    nq = parseInt(args[1]) || 0;
                    if(nq>0){
                        redis.hgetall("poulpita/questions", (err, questions) => {
                            if(nq<=Object.keys(questions).length){
                                client.say(channel, Object.keys(questions)[nq-1])
                                Answer = Object.values(questions)[nq-1].toLowerCase().split("&")
                                answerFlatter()
                                onQuestion = true
                                qTO = setTimeout(() => {questionTimeout(channel)}, 60000);
                            }
                        })
                    }
                }
            }
        }

    })

    client.on("whisper", function (from, user, message, self) {
        if (self) return;
    })
    
    function questionTimeout(channel){
            onQuestion = false
            client.say(channel, "Time's up ! Tu feras mieux la prochaine fois !")
    }

    function questionsAuto(channel){
        if(questionOn){
            setTimeout(() => {questionAutoTimer(channel)}, 60000 * randInt(minQuestionsMessages,maxQuestionsMessages))
        }
    }

    function questionAutoTimer(channel){
        if(!onQuestion){
            redis.get("poulpita/QuestionsMessages", (err, nb) => {
                if(nb>=nbQuestionsMessages){
                    redis.set("poulpita/QuestionsMessages", 0)
                    //POSE UNE QUESTION
                    redis.hgetall("poulpita/questions", (err, questions) => {
                        redis.lrange("poulpita/questions/cache", -100, 100, (err, cachedquestions) => {
                            do{
                                nq = randInt(Object.keys(questions).length)
                                question = Object.keys(questions)[nq]
                                console.log(question)
                            }while(cachedquestions.includes(question))
                            client.say(channel, question)
                            Answer = Object.values(questions)[nq].toLowerCase().split("&")
                            answerFlatter()
                            onQuestion = true
                            qTO = setTimeout(() => {questionTimeout(channel)}, 60000);
                        })
                    })
                }
            })
        }
        setTimeout(() => {questionAutoTimer(channel)}, 60000 * randInt(minQuestionsMessages,maxQuestionsMessages))
    }
}


function randInt(length){
    return Math.floor(Math.random()*length)
}

function answerFlatter(){
    AnswerFlat = []
    Answer.forEach(a => {
        AnswerFlat.push(a.flat())
    })
}

String.prototype.sansAccent = function(){
    var accent = [
        /[\300-\306]/g, /[\340-\346]/g, // A, a
        /[\310-\313]/g, /[\350-\353]/g, // E, e
        /[\314-\317]/g, /[\354-\357]/g, // I, i
        /[\322-\330]/g, /[\362-\370]/g, // O, o
        /[\331-\334]/g, /[\371-\374]/g, // U, u
        /[\321]/g, /[\361]/g, // N, n
        /[\307]/g, /[\347]/g, // C, c
    ];
    var noaccent = ['A','a','E','e','I','i','O','o','U','u','N','n','C','c'];
     
    var str = this;
    for(var i = 0; i < accent.length; i++){
        str = str.replace(accent[i], noaccent[i]);
    }
     
    return str;
}

String.prototype.flat = function(){
    sa = this.sansAccent()
    var regex = /\s/gi;
    sr = sa.replace(regex, "")
    return sr
}

function checkLiveOff(client){
    api.streams.channel({ channelID: idpoulpita }, (err, res) => {
        if(!err) {
            //Live off ???
            if (res.stream == null && !ontest) {
                active = "false"
                clearTimeout(intervalObject)
                redis.del("poulpita/questions/cache")
                console.log("LIVE POULPI OFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF")
            } else {
            }
        } else {
            console.error("unable ")
        }
    })
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

const ete = 2

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

module.exports.start = startBot;
