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

var QPUP = true

var active = false
var onQuestion = false 
var Answer = []
var AnswerFlat = []
var question

function startBot(redisClient) {

    //console.log("ANGELICA ALLOOOOOOOOOOOOOOOOOOOOOOO")

    redis = redisClient

    redis.get("poulpita/active", (err, res) => {
        if(res="true"){
            active = true
        }
    })

    let client = new tmi.client(tmiConfig);
    client.connect().then((server, port) => {
        //console.log(`${tmiConfig.identity.username} logged in on twitch !!!!!!!!!!!!!!!!!!!!!!!!!!!!!`)
        //console.log(`ANGELICA logged in on twitch !!!!!!!!!!!!!!!!!!!!!!!!!!!!!`)
    });

    client.on('chat', (channel, user, message, isSelf) => {

        //redis.get("poulpita/active", (err, active) => {
        if(!active){
            api.streams.channel({ channelID: idpoulpita }, (err, res) => {
                if(!err) {
                    //Live on ???
                    console.log("LIVE POULPI ?")
                    if ( (res.stream != null)) {
                        console.log("LIVE POULPI ONNNNNNNNNNNNNNNNNNNN")
                        active = true
                        redis.set("poulpita/active", "true")
                        intervalObject = setInterval(()=>{
                            checkLiveOff(client)
                        }, 300*60000);
                    }
                }
            })
        }
        //    })
        if(isSelf){ return; }
        //console.log(`ANGELICA chat in on twitch !!!!!!!!!!!!!!!!!!!!!!!!!!!!!`)

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
                //ALLO TWITCH
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
            redis.zrevrange("poulpita/rank", 0, -1, 'WITHSCORES', (err, scores) => {
                //console.log(scores)
                getUserScores(scores).then( (UserScores) => {
                    //console.log(UserScores)
                    ranking = ""
                    rank = 1
                    idboo = true
                    //for(score in UserScores){
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

        function getUserScores(scores){
            var promises = []
            idboo = true
            //for(element in scores){
            scores.forEach(element => {
                //console.log("e "+element)
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
            //console.log("id "+id+" "+username)
            return new Promise(function(resolve, reject){
                redis.hget('ranking/username', id, (err, username) => {
                    //console.log("id "+id+" "+username)
                    resolve(username)
                })
            //.then(username => {
            //    return 
            //})
            })
        }

        if(onQuestion){
            mflat = m.flat()
            //console.log("onquest "+" AnswerFlat "+AnswerFlat+" mflat "+mflat)
            //for(ans in AnswerFlat){
            //AnswerFlat.forEach(ans =>{
                //AnswerFlat.every(function(ans, index) {
                for(var i= 0; i < AnswerFlat.length; i++){
                    var regex = new RegExp("^"+AnswerFlat[i]+"$", "gi")
                //  var regex = new RegExp(ans, "gi")
                  if(regex.test(mflat)){
                      //console.log("regex "+regex+" ans "+ans+" mflat "+mflat)
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
           // }



/*
            if(AnswerFlat.includes(m.flat())){
                onQuestion = false
                client.say(channel, "BRAVO " + displayname + " !")
                redis.zincrby("poulpita/rank", 1, userid)
            }
            */
        }

        let isMod = user.mod || user['user-type'] === 'mod';
        let isBroadcaster = username.toLowerCase() === "poulpita";
        let isHelios = username.toLowerCase() === "heliosdesbois";
        let isModUp = isMod || isBroadcaster || isHelios;

        //console.log(isModUp +" test "+ !onQuestion)

        var args = m.split(" ")
        if(isModUp && !onQuestion){
           // console.log(args)
            if(args[0] == "!question"){
                //console.log("oui")
                if(args.length == 1){
                    //console.log("oui2")
                    //donner une question random
                    redis.hgetall("poulpita/questions", (err, questions) => {
                        //console.log("oui3")
                        redis.lrange("poulpita/questions/cache", -100, 100, (err, cachedquestions) => {
                            console.log(cachedquestions)
                            do{
                                nq = randInt(Object.keys(questions).length)
                                question = Object.keys(questions)[nq]
                                console.log("oui4")
                                console.log(question)
                            }while(cachedquestions.includes(question))
                            //redis.lpush("poulpita/questions/cache", question)
                            console.log("nq "+nq+" max "+Object.keys(questions).length)
                            client.say(channel, question)
                            Answer = Object.values(questions)[nq].toLowerCase().split("&")
                            answerFlatter()
                            console.log(Answer)
                            console.log(AnswerFlat)
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
                                console.log(Answer)
                                console.log(AnswerFlat)
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

        //return
        if (self) return;


    })
    
    
    function questionTimeout(channel){
        //if(onQuestion){
            onQuestion = false
            //client.say(channel, "Time's up ! Il fallait répondre : "+Answer.join(", "))
            client.say(channel, "Time's up ! Tu feras mieux la prochaine fois !")
        //}
    }


}


function randInt(length){
    return Math.floor(Math.random()*length)
}

function answerFlatter(){
    AnswerFlat = []
    //console.log("deb flat" + AnswerFlat)
    Answer.forEach(a => {
        //console.log(a + " -- " + AnswerFlat)
        AnswerFlat.push(a.flat())
        //console.log(a + " -- " + AnswerFlat)
        //console.log(a.flat)
    })
    console.log("fin flat" + AnswerFlat)
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
    //console.log("sa "+sa)
    var regex = /\s/gi;
    sr = sa.replace(regex, "")
    //console.log("sr "+sr)
    return sr
}

//console.log("------------------------------------------------------------")
//console.log("------------------------------------------------------------")
//console.log("------------------------------------------------------------")
var chaine = "À côté d'un veçrre vide";
//console.log( chaine.flat() );

function checkLiveOff(client){
    api.streams.channel({ channelID: idchatdesbois }, (err, res) => {
        if(!err) {
            //Live off ???
            if (res.stream == null && !ontest) {
                active = false
                clearTimeout(intervalObject)
                redis.del("poulpita/questions/cache")
                redis.set("poulpita/active", "false")
                console.log("LIVE POULPI OFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF")
            } else {
            }
        } else {
            console.error("unable ")
        }
    })
}

module.exports.start = startBot;
