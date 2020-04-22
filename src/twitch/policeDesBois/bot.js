const tmi = require('tmi.js')

const tmiConfig = require("./config")

const request = require('request')

var api = require('twitch-api-v5')
api.clientID = process.env.clientID

const apitwitch = require('./api_twitch.js')

const commandManager = require('./command_manager.js')
const timerManager = require('./timer_manager.js')

const {google} = require('googleapis')

const axios = require("axios");
const cheerio = require("cheerio");

const googleClient = new google.auth.JWT(
    process.env.GAPI_email,
    null,
    process.env.GAPI_private_key.replace(/\\n/g, '\n'),
    ['https://www.googleapis.com/auth/spreadsheets']
);

let oauth = process.env.police.split('auth:')[1]
let clientID = process.env.clientID
let url = "https://api.twitch.tv/kraken/channels/"

const pdb = "policedesbois"
const cdb = "chatdesbois"
const cdb2 = "chat des bois"
const hdb = "heliosdesbois"
const ldlc = "teamldlc"
const cdg = "choeur_de_gamers"
const hood = "helioshood"
const krao = "kraoki"

const moderators = ["heliosdesbois", "pioudesbois", "chatdesbois", "solis_the_sun"]
const boss = ["toxiicdust","heliosdesbois"]
const joueursFortnite = ["toxiicdust", "lhotzl", "threshbard", "tutofeeding", "carottounet", "vause", "kraoki"]
const honteurs = ["heliosdesbois", "pioudesbois", "chatdesbois", "kraoki", "hotzdesbois", "aryus80", "shydaxy"]

const ete = 2

var massacresON = true
var lobbiesON = true
var mortsON = true
var mortsLinkON = true
var canonsON = true

const xptimer = 60000
const ontest = (process.env.onTest == "true")
const xpactif = (process.env.xpActif == "true")
var active = false
var justActived = false
var chaters = {}
var timerUpdateXP

var isCached = {}

var idchatdesbois = "122699636"
var idldlc = "42255745"



api.streams.channel({ channelID: idchatdesbois }, (err, res) => {
    if(!err) {
        if(res.stream == null){
            redis.set("honte/user", "null")
        }
    }
})

function chatlog(username, message) {
    let redisDate = dateFull()
    let redisDateInv = redisDate.substr(6,4)+redisDate.substr(2,4)+redisDate.substr(0,2)
    let chatredis = 'chat' + '/' + redisDateInv

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

var redis

function startBot(redisClient) {

    redis = redisClient

    apitwitch.start()

    let client = new tmi.client(tmiConfig);
    client.connect().then(_ => {
        console.log(`${tmiConfig.identity.username} logged in on twitch !`)
        client.whisper(hdb, "Deployed: " + heure());
        console.log(`xp: ${xpactif} test: ${ontest}`)
    }).catch(console.error);

    client.on("whisper", function (from, userstate, message, self) {
        if (self) return;
        
        var m = message.toLowerCase()
        console.log(m)
        console.log(m.startsWith("updateclips"))
        
        if(m.startsWith("updateclips")   && [hdb, cdb, krao, "willokhlass"].indexOf(userstate['username'].toLowerCase()) != -1 ){
            console.log("updatons")
            apitwitch.start(userstate.username, m.split(" ")[1])
            console.log(userstate.username+"/     /"+ m.split(" ")[1])
        }
        if(m.startsWith("updatestats")){
            console.log("updating stats")
        }

        if (m.startsWith("chat") && userstate['display-name'].toLowerCase() == hdb) {
            let chatredis = "chat/" + m.substr(5)
            redis.exists(chatredis, function (err, reply) {
                if (reply === 1) {
                    console.log('exists');
                    redis.get(chatredis, function (err, reply) {
                        console.log(reply);
                    });
                } else {
                    console.log(chatredis + " existe pas")
                }
            });
        }

        if (m.startsWith("zboub") && moderators.indexOf(userstate['display-name'].toLowerCase()) != -1) {
            client.say(hdb, "Sachez que j'adore le zboub")
        }

        if (m.startsWith("say ") && userstate['display-name'].toLowerCase() == hdb) {
            client.say(cdb, message.substr(4));
        }

        if (m.startsWith("sayh ") && userstate['display-name'].toLowerCase() == hdb) {
            client.say(hdb, message.substr(5));
        }
        if (m.startsWith("sayk ") && userstate['display-name'].toLowerCase() == hdb) {
            client.say(krao, message.substr(5));
        }

        if (m.startsWith("sayldlc ") && userstate['display-name'].toLowerCase() == hdb) {
            client.say(ldlc, m.substr(8));
        }
    });

    client.on('chat', (channel, user, message, isSelf) => {
        channelCdb(client, channel, user, message, isSelf, idchatdesbois);
    })
}

/////////* Specific to chatDesBois's channel *//////////////////////////////////

function channelCdb(client, channel, user, message, isSelf, IDchatdesbois) {

    commandManager.chat(channel, user, message, isSelf, client, redis)
    timerManager.chat(channel, user, message, isSelf, client, redis)

    chatlog(user.username, message)

    if(isSelf){
        return
    }

    let m = message.toLowerCase();
    let username = user.username;
    let userid = user['user-id']

    if(username.indexOf("smarrr")!=-1){
        client.ban(channel, username)
    }

    if (!isBoss(username)) {

        var answer = ""

        if (/(^|\W)(je|tu)\speu($|\W|t)/gmi.test(m)) {           //   je/tu peux
            answer += vide(answer) + "je/tu peuX"
        }

        if (/(^|\W)(il|elle|ont?)\speu($|\W|x)/gmi.test(m)) {               //   on peut
            answer += vide(answer) + "on peuT"
        }

        if (/(^|\W)(je|tu)\sveu($|\W|t)/gmi.test(m)) {          //   je/tu veux
            answer += vide(answer) + "je/tu veuX"
        }

        if (/(^|\W)(il|elle|ont?)\sveu($|\W|x)/gmi.test(m)) {               //   on veut
            answer += vide(answer) + "on veuT"
        }

        if (answer != "") { answer += " , l'orthographe veut ton bien-être !" }

        if (/(^|\W)sa\s?va($|\W)/gmi.test(m)) {                 //   sava
            answer += vide(answer) + "*ça va, l'orthographe est ton amie, l'ami !"
        }

        if (/(^|\W)au final($|\W)/gmi.test(m)) {                 //   au final
            answer += vide(answer) + "*finalement ! Tout doux avec la grammaire ! http://www.academie-francaise.fr/au-final ."
        }

        if (/(^|\s)tu\s?(su(sse|se|ce|ss|ç|çe)|susses|suses)(\s|$)/gmi.test(m)) {                 //   au final
            answer += vide(answer) + "*tu suces"
        }

        if (!isBoss(username) && /chatt?e\s?(des|dé|de|d)\s?(bois?|boa)/gmi.test(m)) {                 //   chattedesbois
            redis.lrange('chattedesbois', 0, -1, function (err, reply) {
                if (reply.indexOf(username) == -1) {
                    client.say(channel, username + " raté ! C'est \"chat des bois\", c'est pas si dur pourtant :) Next time, j'te goume !");
                    redis.rpush('chattedesbois', username)
                } else {
                    client.say(channel, username + " je t'avais prévenu !");
                    client.timeout(channel, username, 5)
                }
            });
        }

        //            &&( /(je|ont?)\s(peu.?|).{0,}(duo|squad|skad|jou(|.|..|...))\s?((a|e)ns|ave.\s?toi|\?)/gmi.test(m)  //ON PEUT JOUER ?   |$
        //jou(|.|..|...)

        //je/tu peux m/t'ajouter en ami
        if (!isModerateur(username) && (joueursFortnite.indexOf(username.toLowerCase()) == -1)
            && (/(je|ont?).{0,}(duo|squad|skad)\s?((a|e)ns|ave.\s?toi|\?|$)/gmi.test(m)  //ON PEUT JOUER ?   |$
                || /(je?|ont?)\s?(peu.?|pourr?ai.?)\s?jou(|er|é|es|e|et)\s?((a|e)ns|ave.\s?(toi|vou|vous)|\?|apr)/gmi.test(m)
                || /(je?|ont?)\s?(peu.?|pourr?ai.?)\s?fair.{0,}(parti|gam).{0,}((a|e)ns|ave.\s?(toi|vou|vous)|apr)/gmi.test(m)
                || /tu.{0,}jou(|.|..)\s?ave.\s?(moi|(t|tes|té|les|lé)\s?(vie|fol|abo))/gmi.test(m)
                || /tu\s.{0,}(fait|fé|faire|fai|fais|fair)\s.{0,}(des|dé|d).{0,}gam.{0,}(vi(uv|ew|ev|ouv)eu?r|abo)/gmi.test(m)
                || /can\s?i\s?pl..\s?wh?i..\s?(you|u)/gmi.test(m)
            )
        ) {
            var options = {
                //url: "https://api.twitch.tv/helix/streams?id="+IDchatdesbois,
                url: "https://api.twitch.tv/helix/streams?user_login="+'chatdesbois',
                method: "GET",
                headers: {
                "Authorization": "Bearer "+oauth
                }
            };
            
            request(options, function (error, response, body) {
                if (response && response.statusCode == 200) {
                    let data = JSON.parse(body)
                    res = data.data[0]
                    if (res['game_id'] == 33214) {
                        if (/can\s?i\s?pl..\s?wi..\s?(you|u)/gmi.test(m)) {
                            answer += vide(answer) + "chatdesbois doesn't play with the viouveurs !"
                        } else {
                            answer += vide(answer) + "pas de games viewers sur Fortnite ! Mais sur d'autres jeux ça sera avec plaisir !"
                        }
                        onAnswer(answer)
                    } else { onAnswer(answer) }
                } else {
                    console.error("unable " + response.statusCode)
                }
            })
        } else {
            onAnswer(answer)
        }

        function vide(answer) {
            return answer == "" ? "" : " Et "
        }

        function onAnswer(answer) {
            if (answer != "") {
                client.say(channel, username + " " + answer)
            }
        }

    } // FIN !isBoss

    //J'dirais pas qu'il ait de bonnes ou de mauvaises situations... Mais j'pense quand même que mes games de placement le sont : >> https://www.youtube.com/watch?v=km6DxSc_d1s&t=1s <<
    if (
        (!isBoss(username) && (
            /((c'?est|cé?|ces)|(t|tes|t'est?|tu est?|t'? ?étais?|t'? ?été)) (k|qu)ell?e? (elo|élo|rank)/gmi.test(m)  //ELO ?   |$
        || /(c'?est|cé?|ces) (qu|k)oi (le |l'? ?)(elo|élo|rank)/gmi.test(m)
        || /(on est?|vous? .tes?) (sur|a|à) (k|qu)ell?e? (elo|élo|rank)/gmi.test(m)
        || /(k|qu)ell?e? (elo|élo|rank) ?\?/gmi.test(m)
        ))
        || /^!(elo|élo|rank) ?$/gmi.test(m)
    ) {
        var options = {
            url: "https://api.twitch.tv/helix/streams?user_login="+'chatdesbois',
            method: "GET",
            headers: {
            "Authorization": "Bearer "+oauth
            }
        };
        
        request(options, function (error, response, body) {
            if (response && response.statusCode == 200) {
                let data = JSON.parse(body)
                res = data.data[0]
                if(res != undefined && res['game_id'] == 21779){
                    redis.hget("commands/description", "!elo", (err, reply) => {
                        getDataLol().then( (a) => {
                            client.say(channel, user['display-name'] + ", on est " + a + ", road to plat ! "+ reply)
                        })
                    })
                }
            }
            else {
                console.error("unable league")
            }
        })
    }
    if ( m.startsWith("!-honte") ){
        newHonteux = m.split(" ")[1]
        if(isHonteur(username) && newHonteux != undefined){
            redis.hget("ranking/id", newHonteux, function(err, newHonteuxID){
                // console.log(newHonteuxID)
                if(newHonteuxID != null){
                    redis.zincrby("honte/nombres", -1, newHonteuxID, function(err, dfh){
                    })
                }
            })
        }
    }

    if ( m.startsWith("!honte") ){
        newHonteux = m.split(" ")[1]
        if(newHonteux != undefined && isHonteur(username)){
                    redis.get("honte/user", function(err, honteuxID){
                        if(!err && honteuxID != null){
                            redis.get("honte/actuel", function(err, time){
                                redis.hget("ranking/username", honteuxID, function(err, honteux){
                                    redis.hget("ranking/id", newHonteux, function(err, newHonteuxID){
                                        if(newHonteuxID != null){
                                            redis.hget("ranking/username", newHonteuxID, function(err, newHonteux){
                                                if(honteuxID != "null"){
                                                    client.say(channel, 
                                                    honteux + " passe le bâton de la honte à " + newHonteux)
                                                }else{
                                                    client.say(channel, newHonteux + " récupère le bâton de la honte")
                                                }
                                            redis.set("honte/user", newHonteuxID)
                                            redis.zincrby("honte/nombres", 1, newHonteuxID)
                                            redis.set("honte/actuel", "0")
                                            })  
                                        }
                                    })
                                })
                            })
                        }
                    })
        }else{
            redis.get("honte/actuel", function(err, time){
                redis.get("honte/user", function(err,honteuxID){
                    if(honteuxID != "null"){
                        redis.hget("ranking/username", honteuxID, function(err, honteux){
                            if(!err){
                                client.say(channel, "Le bâton de la honte est fièrement porté par " + honteux
                                + " depuis " + time + " minute" + (parseInt(time)>1? "s " : " ") 
                                )
                            }
                        })
                    }else{
                        client.say(channel, "Le bâton de la honte ne demande qu'à être récupéré!")
                    }
                })
            })
        }
    }

    if ( m.startsWith("!stathonte") ){
        honteux = m.split(" ")[1]
        if(honteux == undefined){
            honteux = username
        }
        redis.hexists("ranking/id", honteux, function(err, exists){
            if(exists){
                redis.hget("ranking/id", honteux, function(err, honteuxID){
                    redis.hget("ranking/username", honteuxID, function(err, honteux){
                        redis.zscore("honte/nombres", honteuxID, function(err, nombre){
                            if(nombre != null){
                                redis.zscore("honte/temps", honteuxID, function(err,  temps){
                                        client.say(channel, honteux + " : " + nombre + " bâton" + (parseInt(nombre)>1? "s" : "") + " / "
                                            + (temps==undefined? 0 : temps) + " minute" + (parseInt(temps)>1? "s" : "") + " de honte à son actif" )
                                })
                            }else{
                                client.say(channel, honteux + " n'a pas encore connu la honte")
                            }
                        })
                    })
                })
            }else{
                client.say(channel, honteux + " est inconnu au bataillon de la honte")
            }
        })
    }


    if (/^!massacres?\s?\+\s?1$/gmi.test(m)) { //*massacre -> incremente
        massacresON = false
        setTimeout(function () {
            massacresON = true
        }, 15000); 
        
        redis.incr('massacres', function (err, reply) {
            afficheMassacres(client, channel, parseInt(reply));
        });

    } else if (/^!massacres?$/gmi.test(m)) { //*massacres -> affiche le nb
        redis.get('massacres', function (err, reply) {
            afficheMassacres(client, channel, parseInt(reply));
        });

    } else if (isModerateur(user.username) && /^!massacres?\s?\-\s?1$/gmi.test(m)) {
        redis.decr('massacres', function (err, reply) {
            afficheMassacres(client, channel, parseInt(reply));
        });
    }
    else if (isModerateur(user.username) && /^!massacres? \d/gmi.test(m)) {
        massacres = parseInt(m.slice(9 + 1)) || 0;
        afficheMassacres(client, channel, massacres);
        redis.set('massacres', massacres);
    }


    if (/^!morts?\s?\+\s?1$/gmi.test(m) || /^!lobb?y\s?\+\s?1$/gmi.test(m) || /^!cann?ons?\s?\+\s?1$/gmi.test(m) || /^!link\s?\+\s?1$/gmi.test(m) ) {

        var options = {
            url: "https://api.twitch.tv/helix/streams?user_login="+'chatdesbois',
            method: "GET",
            headers: {
            "Authorization": "Bearer "+oauth
            }
        };
        
        request(options, function (error, response, body) {
            if (response && response.statusCode == 200) {
                let data = JSON.parse(body)
                res = data.data[0]
                if (/^!morts?\s?\+\s?1$/gmi.test(m) && mortsON) { //*morts? -> incremente
                    
                    if(res != undefined && res['game_id'] == 000){
                        mortsON = false
                        setTimeout(function () {
                            mortsON = true
                        }, 15000); 
                        
                        redis.incr('morts', function (err, reply) {
                            afficheMorts(client, channel, parseInt(reply));
                        });
                
                    }
                
                }
                
                if ( (/^!morts?\s?\+\s?1$/gmi.test(m) && mortsLinkON) || (/^!link\s?\+\s?1$/gmi.test(m) && mortLinkON) ) {
                    if(res != undefined && res['game_id'] == 110758){
                        mortsLinkON = false
                        setTimeout(function () {
                            mortsLinkON = true
                        }, 15000); 
                        
                        redis.incr('mortsLink', function (err, reply) {
                            afficheMortsLink(client, channel, parseInt(reply));
                        });
                
                    }

                }else if (/^!lobb?y\s?\+\s?1$/gmi.test(m) && lobbiesON) { //*lobby -> incremente
                                
                    if(res != undefined && res['game_id'] == 33214){

                        lobbiesON = false
                        setTimeout(function () {
                            lobbiesON = true
                        }, 30000); 
                
                        redis.incr('lobbies', function (err, reply) {
                            afficheLobbies(client, channel, parseInt(reply));
                        });
                
                    }

                }else if (/^!cann?ons?\+\s?1$/gmi.test(m) && canonsON) { //*canons -> incremente
                    if(res != undefined && res['game_id'] == 21779){
                        canonsON = false
                        setTimeout(function () {
                            canonsON = true
                        }, 30000); 
                
                        redis.incr('canons', function (err, reply) {
                            afficheCanons(client, channel, parseInt(reply));
                        });
                    }
                }
            }
        })
    }

    if (/^!lobb?y$/gmi.test(m)) { //*lobby -> affiche le nb
        redis.get('lobbies', function (err, reply) {
            afficheLobbies(client, channel, parseInt(reply));
        });
    } else if (isModerateur(user.username) && /^!lobb?y\s?\-\s?1$/gmi.test(m)) {
        redis.decr('lobbies', function (err, reply) {
            afficheLobbies(client, channel, parseInt(reply));
        });
    } else if (isModerateur(user.username) && /^!lobb?y \d/gmi.test(m)) {
        lobbies = parseInt(m.slice(7 + 1)) || 0;
        afficheLobbies(client, channel, lobbies);
        redis.set('lobbies', lobbies);
    } else if (/^!lobb?y\?$/gmi.test(m)) {
        client.say(channel, "https://clips.twitch.tv/GracefulDistinctTitanLitFam")
    }

    api.streams.channel({ channelID: idchatdesbois }, (err, res) => {
        game = res == undefined ? "null" : res.stream.game.toLowerCase()
        if(game.includes("tomb raider") || game.includes("lara croft")){
            mortRedis = "morts"
            mortFunction = afficheMorts
        }else{
            mortRedis = "mortsLink"
            mortFunction = afficheMortsLink
        }
        if (/^!morts?$/gmi.test(m)) { //*morts -> affiche le nb
            redis.get(mortRedis, function (err, reply) {
                mortFunction(client, channel, parseInt(reply));
            });
    
        } else if (isModerateur(user.username) && /^!morts?\s?\-\s?1$/gmi.test(m)) {
            redis.decr(mortRedis, function (err, reply) {
                mortFunction(client, channel, parseInt(reply));
            });
        }
        else if (isModerateur(user.username) && /^!morts? \d/gmi.test(m)) {
            morts = parseInt(m.slice(5 + 1)) || 0;
            mortFunction(client, channel, morts);
            redis.set(mortRedis, morts);
        }

    })

    if (/^!cann?ons?$/gmi.test(m)) { //*canons -> affiche le nb
        redis.get('canons', function (err, reply) {
            afficheCanons(client, channel, parseInt(reply));
        });
    } else if (isModerateur(user.username) && /^!cann?ons?\s?\-\s?1$/gmi.test(m)) {
        redis.decr('canons', function (err, reply) {
            afficheCanons(client, channel, parseInt(reply));
        });
    }
    else if (isModerateur(user.username) && /^!canons \d/gmi.test(m)) {
        canons = parseInt(m.slice(7 + 1)) || 0;
        afficheCanons(client, channel, canons);
        redis.set('canons', canons);
    }

    
    if (m.startsWith("arretez")) {
        api.other.chatters({channelName: channel.slice(1)}, (err, res) => {
            if(!err){
                let viewers = Object.values(res.chatters).reduce((accumulator, array) => accumulator.concat(array), [])
                let words = message.split(" ")
                if (words.length > 1) {
                    let word = m.substr(m.indexOf(" ") + 1);
                    if (isModerateur(username) || (word.toLowerCase() != "policedesbois" && word.toLowerCase() != "heliosdesbois" && viewers.indexOf(word.toLowerCase()) != -1)) {
                        client.say(channel, word + ", vous êtes en état d'arrestation !");
                    }
                }
            } else {
                console.error("unable ")
            }
        })
    }

    if (m.startsWith("!master+1")) {
        words = m.split(" ")
        if (words.length > 1 && isModerateur(username)) {
            username = words[1].toLowerCase().replace("@", "")
            redis.hget('ranking/id',username,function(err,userid){
                if(!err){
                    redis.hget('ranking/username',userid,function(err,userdname){
                        if(userdname != null){
                            redis.hincrby('master/wins', userid, 1, function(err, wins){
                                client.say(channel, wins + (wins == 1 ? 're' : 'e') + ' victoire de ' + userdname + ' !')
                            })
                        }else{
                            client.say(channel, username + ' est inconnu')
                        }
                    })
                }
            })
        }
    }

    if (m.startsWith("!master ")) {
        words = m.split(" ")
        if (words.length > 1) {
            username = words[1].toLowerCase().replace("@", "")
            redis.hget('ranking/id',username,function(err,userid){
                if(!err){
                    redis.hget('ranking/username',userid,function(err,userdname){
                        if(userdname != null){
                            redis.hget('master/wins', userid, function(err, wins){
                                wins = wins || 0
                                client.say(channel, userdname + ' a gagné ' + wins + ' fois !')
                            })
                        }else{
                            client.say(channel, username + ' est inconnu')
                        }
                    })
                }
            })
        }

    }


///////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////XP SYSTEM///////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////

    if(userid!=undefined && username!=cdb && username!='nightbot'){
        if(isCached[userid]!=true){
            isCached[userid]=true
            var options = {
                url: "https://api.twitch.tv/helix/users?id="+userid,
                method: "GET",
                headers: {
                "Authorization": "Bearer "+oauth
                }
            };
            
            request(options, function (error, response, body) {
                if (response && response.statusCode == 200) {
                    data = JSON.parse(body)
                    res=data.data[0]
                    redis.hset('ranking/logo', userid, res['profile_image_url'])
                    redis.hset('ranking/username',userid, user['display-name'])
                    redis.hset('ranking/color', userid, user.color)
                    redis.hset('ranking/id', username, userid)
                }else{
                    console.log("api failed "+response.statusCode)
                }
            });
        }
        chaters[userid] = 10
    }

    if(justActived){
        justActived = false
        active = true
        timerUpdateXP = setInterval(()=>{
            updateXp(client, IDchatdesbois)
        }, xptimer);

        timerManager.initTimers(channel, client, redis)
    }

    if (!active) {
        api.streams.channel({ channelID: idchatdesbois }, (err, res) => {
            if(!err) {
                //Live on ???
                if ( (res.stream != null || ontest)&&xpactif) {
                    console.log("LIVE ONNNNNNNNNNNNNNNNNNNN")
                    justActived = true
                }
            } else {
                console.error("unable ")
            }
        })
    }

    if(xpactif && !ontest){
        if (/^!((mtop|top(m|mensuel|))|mensuel)$/gmi.test(m)) {
                onTop(client, '')
        }
        if (/^!((gtop|top(g|global))|global)$/gmi.test(m)) {
            onTop(client, 'global')
        }

        if (/^!(mlvl|mlevel|(lvl|level)(m|mensuel| |$))/gmi.test(m)) {
            onCommand(client, m, user, dateXp(), 'lvl')
        }
        if (/^!((g|global)(lvl|level)|(lvl|level)(g|global))/gmi.test(m)) {
            onCommand(client, m, user, 'global', 'lvl')
        }
        if (/^!(mxp|xp(m|mensuel| |$))/gmi.test(m)) {
            onCommand(client, m, user, dateXp(), 'xp')
        }
        if (/^!((g|global)xp|xp(g|global))/gmi.test(m)) {
            onCommand(client, m, user, 'global', 'xp')
        }
    }
}

function isModerateur(username) {
    return moderators.indexOf(username.toLowerCase()) != -1;
}

function isHonteur(username) {
    return honteurs.indexOf(username.toLowerCase()) != -1;
}

function isBoss(username) {
    return ( (moderators.indexOf(username.toLowerCase()) != -1) || (boss.indexOf(username.toLowerCase()) != -1 ) );
}

function afficheMassacres(client, channel, massacres) {
    client.say(
        channel,
        `Chatdesbois a massacré ${massacres} pseudo${massacres > 1 ? "s" : ""} en toute impunité ! 👌🏻 (depuis mars 2019)`
    );
}

function afficheLobbies(client, channel, lobbies) {
    client.say(
        channel,
        `Chatdesbois est retournée ${lobbies} fois au lobby, qui peut la stopper ?`
    );
}

function afficheMorts(client, channel, morts) {
    client.say(
        channel,
        `Lara Croft est morte ${morts} fois`
    );
}

function afficheMortsLink(client, channel, morts) {
    client.say(
        channel,
        `Link est mort ${morts} fois depuis le début !`
    );
}

function afficheCanons(client, channel, canons) {
    client.say(
        channel,
        `${canons} canons ont été ratés ! 👌🏻 (depuis novembre 2019)`
    );
}

function heure() {
    let date = new Date();
    let heure = date.getHours() + ete;
    let minutes = date.getMinutes();
    if (minutes < 10) {
        minutes = "0" + minutes;
    }
    return date.getDate() + ":" + (date.getMonth() + 1) + " " + (heure) + "h" + minutes;
}

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

///////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////XP FUNCTIONS/////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////

function onCommand(client, m, user, date, mode){
    let words = m.split(" ")
    if (words.length > 1) {
        username = words[1].toLowerCase().replace("@", "")
        redis.hget('ranking/id',username,function(err,userid){
            if(!err){
                redis.hget('ranking/username',userid,function(err,userdname){
                    commandAnswer(client, userdname, userid, date, mode)
                })
            }
        })
    }else{
        commandAnswer(client, user['display-name'], user['user-id'], date, mode)
    }
}

function onTop(client, top){
    classement = top != ''? 'GLOBAL' : 'MENSUEL'
    client.say(cdb, 'Qui est devant toi dans le classement '+classement+'? Des genoux à casser ? La réponse ici ! ➡️ http://top.chatdesbois.stream/'+top)
}

function commandAnswer(client, userdname, userid, date, mode){
    let ranking = " (mensuel)"
    if(date=='global'){
        ranking = " (global)"
    }
    redis.zscore('ranking/xp/' + date, userid, function (err, score) {
        levelint = level(parseInt(score))
        if(mode=='lvl'){
            levelint = isNaN(levelint) ? 0 : levelint    
            redis.zrevrank('ranking/xp/' + date, userid, function (err, rank) {
                client.say(cdb, userdname + ": #" + (rank + 1) + " Level " + levelint + ' ('+score+'/'+xp(levelint+1)+' XP) '+ ranking)
            })
        }else if(mode=='xp'){
            nextlevelint = isNaN(levelint) ? 0 : (level(parseInt(score)) + 1)    
            xpleftint = isNaN(levelint) ? 0 : xpLeft(parseInt(score))

            client.say(cdb, userdname + ": " + xpleftint + " XP to lvl " + nextlevelint + ranking)
        }
    })
}

function updateXp(client, IDchatdesbois) {

    if(xpactif){
        redis.get("honte/user", function(err, honteuxID){
            redis.zincrby("honte/temps", 1, honteuxID)
        })
        redis.get("honte/actuel", function(err, time){
            redis.set("honte/actuel", ""+(parseInt(time)+1) )
        })
    }

    for (var userid in chaters) {
        chaters[userid] -= 1
        if (chaters[userid] == 0) {
            delete chaters[userid]
        }
        date = dateXp()
        xpgain = randInt(4, 5)
        if(xpactif && !ontest){
            checkLevelUp(client, userid, xpgain, date)
        }
    }

    api.streams.channel({ channelID: idchatdesbois }, (err, res) => {
        if(!err) {
            //Live off ???
            if (res.stream == null && !ontest) {
                active = false
                timerManager.removeAllTimers()
                clearTimeout(timerUpdateXP)
                redis.set("honte/user", "null")
                console.log("LIVE OFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF")
            }
        } else {
            console.error("unable ")
        }
    })
}

function checkLevelUp(client, userid, xpgain, date){

    redis.zscore('ranking/xp/'+ date, userid, (err, score)=>{
        var score=parseInt(score)
        var lvl=level(score)

        redis.zscore('ranking/xp/global', userid, (err, score0)=>{
            var score0=parseInt(score0)
            var lvl0=level(score0)

            var upm = (score + xpgain >= xp(lvl + 1))
            var upg = (score0 + xpgain >= xp(lvl0 + 1))

            if(upg){
                redis.hget('ranking/username', userid, (err, username)=>{
                    if(lvl0 == 0 || (lvl0>0 && (lvl0+1)%2 == 1) || lvl0>8 ){
                        client.whisper(username.toLowerCase(), "Level global up chez Chatdesbois ! -> Lvl "+(lvl0+1) )
                    }
                    chatlog("policedesbois", '/me '+username + " passe level "+(lvl0+1)+" ! (global)" )
                })
            }
            if(upm){
                redis.hget('ranking/username', userid, (err, username)=>{
                    if( (lvl+1)%5 == 0){
                        client.say(cdb, '/me '+username + " passe level "+(lvl+1)+" ! (mensuel)" ) 
                        chatlog("policedesbois", '/me '+username + " passe level "+(lvl+1)+" ! (mensuel)" ) 
                    }
                })
            }
            redis.zincrby('ranking/xp/' + date, xpgain, userid)
            redis.zincrby('ranking/xp/global', xpgain, userid)
        })
    })
}

//XP avant de up
function xpLeft(xp0) {
    return (xp(level(xp0) + 1) - xp0)
}

//% d'XP du lvl en cours
function progress(xp0) {
    lvl = level(xp0)
    xplvl= xp(lvl)
    return ( Math.floor( 100*( xp0 - xplvl /(xp(lvl+1) - xplvl) ) ) )
}

//XP totale pour etre un level donné
function xp(level0) {
    return (16 * (level0 * level0 - 1) + 100 * level0)
}

//Level associé a un montant d'XP
function level(xp0) {
    //return (Math.round((Math.sqrt(xp0 + 172.25) - 12.5) / 4))
    return (Math.floor(0.000000001+(Math.sqrt(xp0 + 172.25) - 12.5) / 4))
}

//Entier random
function randInt(minimum, maximum) {
    return Math.floor((Math.random() * (maximum - minimum + 1)) + minimum)
}

//Date au format aaaa/mm
function dateXp() {
    let date = new Date();
    let month = date.getMonth() + 1;
    if (month < 10) {
        month = "0" + month;
    }
    return date.getFullYear() + '/' + month
}

function dateFullSplited() {
    let date = new Date();
    let month = date.getMonth() + 1;
    let jour = date.getDate();
    if (jour < 10) {
        jour = "0" + jour;
    }
    if (month < 10) {
        month = "0" + month;
    }
    return [date.getFullYear(), month, jour]
}

function dateFullHours() {
    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let hours = date.getHours();
    let minutes = date.getMinutes();
    
    if (minutes < 10) {
        minutes = "0" + minutes;
    }
    if (hours < 10) {
        hours = "0" + hours;
    }
    if (day < 10) {
        day = "0" + day;
    }
    if (month < 10) {
        month = "0" + month;
    }
    return {year, month, day, hours, minutes}
}

const getDataLol = async () => {
    const result = await axios.get("https://www.leagueofgraphs.com/en/summoner/euw/Chat+des+bois")
    const searchData = cheerio.load(result.data)
    var rank
    searchData('div.mainRankingDescriptionText').each(function(i, e){
        var a = searchData(this);
        let tier = a.children(".leagueTier").text().replace(/( |^) | ( |$)/gmi, '')
        let lps =  a.children(".league-points").text().replace("LP: ", "")
        let winslosses = a.children(".winslosses").text().replace(/( |^) | ( |$)/gmi, '').replace(/\n/gmi, '').replace("Wins: ", "").replace("Losses: ", "W/")
        rank = tier + ' ' + lps+' LP ('+winslosses+'L)'
    })
    return(rank)
}

///////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////XP FUNCTIONS/////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////

function GetAllAnalytics(){
    promises = []

    for(var annee = 2019; annee <2020; annee++){
        for(var mois = 7; mois <8; mois++){
            if(mois<10){
                mois = '0' + mois
            }
            for(var jour = 1; jour <32; jour++){
                if(jour<10){
                    jour = '0' + jour
                }
                promises.push(getAnalytics(annee, mois, jour))
            }
        }
    }
    Promise.all(promises).then( res => {

        var res2 = []
        res2.push(["Date", "Stream duration", "Total", "Max", "Followers", "Views", 'Moyenne'])

        res.forEach( a => {
            if(a != ""){
                a.push(Math.round(a[2]/a[1]))
                let b = a[1]%60
                if( b < 10){
                    b = '0' + b
                }
                a[1] = Math.trunc(a[1]/60) + ":" + b
                res2.push(a)
            }
        })
        
        googleClient.authorize(function(err,tokens){
            if(err){
                console.log(err);
                throw err;
            }
            const gsapi = google.sheets({version:'v4', auth: googleClient});
        
            var updateOpt = {
                spreadsheetId: process.env.SheetAnalytics,
                range: "Analytics!A:G",
                valueInputOption: 'USER_ENTERED',
                resource : {
                    majorDimension: "ROWS",
                    values: res2
                }
            };
            gsapi.spreadsheets.values.update(updateOpt)
        });
    })
}

function getAnalytics(annee, mois, jour){
    return new Promise( (resolve, reject) => {
        redis.exists(`analytics/${cdb}/${annee}/${mois}/${jour}`, function(err, exists){
            if(exists){
                redis.hvals(`analytics/${cdb}/${annee}/${mois}/${jour}`, function(err, reply){
                    if(!err){
                        resolve([`${jour}/${mois}/${annee}`].concat(reply))
                    }else{
                        reject("apiclips failed")
                    }
                })
            }
            else{
                resolve("")
            }
        })
    })
}

function GetViewersAnalytics(){

    var data = []
    data.push(["date", "viewers"])

    redis.hgetall(`analytics/${cdb}/viewersEvolution`, function(err, res){
        if(!err && res != null){

            for (let [key, value] of Object.entries(res)) {
                data.push([key, value]);
            }
            
            googleClient.authorize(function(err,tokens){
                if(err){
                    console.log(err);
                    throw err;
                }
                const gsapi = google.sheets({version:'v4', auth: googleClient});
        
                var updateOpt = {
                    spreadsheetId: process.env.SheetAnalytics,
                    range: "Evolution!A:B",
                    valueInputOption: 'USER_ENTERED',
                    resource : {
                        majorDimension: "ROWS",
                        values: data
                    }
                };
                gsapi.spreadsheets.values.update(updateOpt)
            });
        }
    })
}

module.exports.start = startBot;

