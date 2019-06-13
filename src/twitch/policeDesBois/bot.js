const tmi = require('tmi.js')

const tmiConfig = require("./config")

const request = require('request')

var api = require('twitch-api-v5')
api.clientID = process.env.clientID

var redis = require('redis').createClient(process.env.REDIS_URL);
redis.on('connect', function () {
    console.log('connected');
});



let clientID = process.env.clientID
// let url = "https://api.twitch.tv/kraken/channels/chatdesbois?client_id="
let url = "https://api.twitch.tv/kraken/channels/"

const pdb = "policedesbois"
const cdb = "chatdesbois"
const cdb2 = "chat des bois"
const hdb = "heliosdesbois"
const ldlc = "teamldlc"
const cdg = "choeur_de_gamers"
const hood = "helioshood"
const krao = "kraoki"

const moderators = ["heliosdesbois", "pouidesbois", "chatdesbois", "solis_the_sun"]
const boss = ["toxiicdust","heliosdesbois"]
const joueursFortnite = ["toxiicdust", "lhotzl", "threshbard", "tutofeeding", "carottounet", "vause", "kraoki"]

const ete = 2

var massacresON = true
var lobbiesON = true
var mortsON = true

const xptimer = 5000
const ontest = false
const xpacitf = true
var active = false
var chaters = {}
var intervalObject
var isCached = {}


function chatlog(username, message) {
    let redisDate = dateFull()
    let redisDateInv = redisDate.substr(6,4)+redisDate.substr(2,4)+redisDate.substr(0,2)
    let chatredis = 'chat' + '/' + redisDateInv

    // console.log("**************************************" + redisDate)
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
        client.whisper(hdb, "Deployed: " + heure());
    }).catch(console.error);


    client.on("whisper", function (from, userstate, message, self) {

        if (self) return;



        let m = message.toLowerCase()

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


        if (channel.indexOf(ldlc) != -1) {
            request('https://api.twitch.tv/kraken/channels/' + ldlc + '?client_id=' + process.env.clientID, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    let data = JSON.parse(body);
                    if (data.status.toLowerCase().indexOf(cdb) != -1 || data.status.toLowerCase().indexOf(cdb2) != -1) {
                        channelCdb(client, channel, user, message, isSelf);
                    }
                } else {
                    console.error("unable ");
                }
            })
        } else if (channel.indexOf(cdg) != -1) {


            request('https://api.twitch.tv/kraken/channels/' + cdg + '?client_id=' + process.env.clientID, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    let data = JSON.parse(body);
                    if (data.status.toLowerCase().indexOf(cdb) != -1 || data.status.toLowerCase().indexOf(cdb2) != -1) {
                        channelCdb(client, channel, user, message, isSelf);
                    }else{
                    }
                } else {
                    console.error("unable ");
                }
            })
        } else {
            channelCdb(client, channel, user, message, isSelf);
        }
    });
}

/////////* Specific to chatDesBois's channel *//////////////////////////////////

//if (channel.indexOf(cdb) != -1 || channel.indexOf(ldlc)!=-1) { //return }

function channelCdb(client, channel, user, message, isSelf) {

    chatlog(user.username, message)

    let m = message.toLowerCase();
    let username = user.username;
    let userid = user['user-id']

    if (username.toLowerCase() != hdb && !isBoss(username)) {

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
            answer += vide(answer) + "*ça va, l'orthographe est ton ami, l'ami !"
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
            request(url + channel.substr(1) + "?client_id=" + clientID, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    let data = JSON.parse(body)
                    //console.log(data.game)
                    if (data.game.toLowerCase() == "fortnite") {
                        //console.log("bite2")
                        // client.say(channel,"Pas de games viewers sur Fortnite ! Mais sur d'autres jeux ça sera avec plaisir !")
                        if (/can\s?i\s?pl..\s?wi..\s?(you|u)/gmi.test(m)) {
                            answer += vide(answer) + "chatdesbois doesn't play with the viouveurs !"
                        } else {
                            answer += vide(answer) + "pas de games viewers sur Fortnite ! Mais sur d'autres jeux ça sera avec plaisir !"
                        }
                        onAnswer(answer)
                    } else { onAnswer(answer) }
                } else {
                    console.error("unable ")
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

    }



    if (/^!massacre\s?\+\s?1$/gmi.test(m)) { //*massacre -> incremente
        massacresON = false
        setTimeout(function () {
            massacresON = true
        }, 15000); 
        
        redis.incr('massacres', function (err, reply) {
            afficheMassacres(client, channel, parseInt(reply));
        });

    } else if (/^!massacre$/gmi.test(m)) { //*massacres -> affiche le nb
        redis.get('massacres', function (err, reply) {
            afficheMassacres(client, channel, parseInt(reply));
        });

    } else if (isModerateur(user.username) && /^!massacre\s?\-\s?1$/gmi.test(m)) {
        redis.decr('massacres', function (err, reply) {
            afficheMassacres(client, channel, parseInt(reply));
        });
    }
    else if (isModerateur(user.username) && /^!massacre \d/gmi.test(m)) {
        massacres = parseInt(m.slice(9 + 1)) || 0;
        afficheMassacres(client, channel, massacres);
        redis.set('massacres', massacres);
    }


    if (/^!morts?\s?\+\s?1$/gmi.test(m) || /^!lobb?y\s?\+\s?1$/gmi.test(m) ) { 

        request(url + channel.substr(1) + "?client_id=" + clientID, function (error, response, body) {


            if (!error && response.statusCode == 200) {
                let data = JSON.parse(body)
                if ( (data.game.toLowerCase().indexOf("tomb raider") != -1) || (data.game.toLowerCase().indexOf("lara croft") != -1) ) {
                    
                    if (/^!morts?\s?\+\s?1$/gmi.test(m) && mortsON) { //*morts? -> incremente
                        mortsON = false
                        setTimeout(function () {
                            mortsON = true
                        }, 15000); 
                        
                        redis.incr('morts', function (err, reply) {
                            afficheMorts(client, channel, parseInt(reply));
                        });
                
                    }

                }else if (data.game.toLowerCase() == "fortnite") {

                    if (/^!lobb?y\s?\+\s?1$/gmi.test(m) && lobbiesON) { //*lobby -> incremente
                        lobbiesON = false
                        setTimeout(function () {
                            lobbiesON = true
                        }, 30000); 
                
                        redis.incr('lobbies', function (err, reply) {
                            afficheLobbies(client, channel, parseInt(reply));
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



    if (/^!morts?$/gmi.test(m)) { //*morts -> affiche le nb
        redis.get('morts', function (err, reply) {
            afficheMorts(client, channel, parseInt(reply));
        });

    } else if (isModerateur(user.username) && /^!morts?\s?\-\s?1$/gmi.test(m)) {
        redis.decr('morts', function (err, reply) {
            afficheMorts(client, channel, parseInt(reply));
        });
    }
    else if (isModerateur(user.username) && /^!morts? \d/gmi.test(m)) {
        morts = parseInt(m.slice(5 + 1)) || 0;
        afficheMorts(client, channel, morts);
        redis.set('morts', morts);
    }

    
    if (m.startsWith("arretez")) {
        //console.log(channel)
        request('https://tmi.twitch.tv/group/user/' + channel.slice(1) + '/chatters', function (error, response, body) {
            if (!error && response.statusCode == 200) {
                let data = JSON.parse(body)
                let viewers = Object.values(data.chatters).reduce((accumulator, array) => accumulator.concat(array), [])
                let words = message.split(" ")
                if (words.length > 1) {
                    // let word = words[1]
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


///////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////XP SYSTEM/////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////

    if(userid!=undefined && username!=cdb){
        if(isCached[userid]!=true){
            isCached[userid]=true
            //ALLO TWITCH
            api.users.userByID({ userID: userid }, (err, res) => {
                if(!err) {
                    redis.hset('ranking/logo', userid, res.logo)
                    redis.hset('ranking/username',userid, user['display-name'])
                    redis.hset('ranking/id', username, userid)
                }
            })
        }
        chaters[userid] = 10
    }

    if (!active) {
        request('https://api.twitch.tv/kraken/streams/' + cdb + '?client_id=' + clientID, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                let data = JSON.parse(body)
                //Live on ???
                if ( (data.stream != null || ontest)&&xpacitf) {
                    console.log("LIVE ONNNNNNNNNNNNNNNNNNNN")
                    active = true
                    intervalObject = setInterval(function(client){
                        updateXp(client)
                    }, xptimer);
                } else {
                }
            } else {
                console.error("unable ")
            }
        })
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

}//fin if channel cdb





function isModerateur(username) {
    return moderators.indexOf(username.toLowerCase()) != -1;
}

function isBoss(username) {
    return ( (moderators.indexOf(username.toLowerCase()) != -1) || (boss.indexOf(username.toLowerCase()) != -1 ) );
}

function afficheMassacres(client, channel, massacres) {
    client.say(
        channel,
        `Chatdesbois a massacré ${massacres} pseudo${massacres > 1 ? "s" : ""} en toute impunité ! 👌🏻`
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
        commandAnswer(client, user['display-name'], user['user-id'], date, mode)
    }
}

function commandAnswer(client, userdname, userid, date, mode){
    let ranking = " (mensuel)"
    if(date=='global'){
        ranking = " (global)"
    }
    redis.zscore('ranking/xp/' + date, userid, function (err, score) {
        if(mode=='lvl'){
            redis.zrevrank('ranking/xp/' + date, userid, function (err, rank) {
                client.say(cdb, userdname + ": #" + (rank + 1) + " Level " + level(parseInt(score)) + ranking)
            })
        }else if(mode=='xp'){
            client.say(cdb, userdname + ": " + xpLeft(parseInt(score)) + " XP to lvl " + (level(parseInt(score)) + 1) + ranking)
        }
    })
}

function updateXp(client) {
    for (var userid in chaters) {
        chaters[userid] -= 1
        if (chaters[userid] == 0) {
            delete chaters[userid]
        }
        date = dateXp()
        xpgain = randInt(4, 5)
        //checkLevelUp(client, userid, xpgain,date)
        redis.zincrby('ranking/xp/' + date, xpgain, userid)
        redis.zincrby('ranking/xp/global', xpgain, userid)
    }
    request('https://api.twitch.tv/kraken/streams/' + cdb + '?client_id=' + clientID, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            let data = JSON.parse(body)
            //Live off ???
            if (data.stream == null && !ontest) {
                active = false
                clearTimeout(intervalObject)
                console.log("LIVE OFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF")
            } else {
            }
        } else {
            console.error("unable ")
        }
    })
}

function checkLevelUp(client, userid, xpgain){
    redis.zscore('ranking/xp/'+ date, userid, function(err, score){
        score=parseInt(score)
        lvl=level(score)
        if(score + xpgain >= xp(lvl + 1)){
            redis.hget('ranking/username', userid, function(err, username){
                client.whisper(username.toLowerCase(), "Level mensuel up chez Chatdesbois ! -> Lvl "+(lvl+1) )
            })
        }
    })
    redis.zscore('ranking/xp/global', userid, function(err, score0){
        score0=parseInt(score0)
        lvl0=level(score0)
        if(score0 + xpgain >= xp(lvl0 + 1)){
            // console.log('up global')
            redis.hget('ranking/username', userid, function(err, username){
                client.say(cdb, username + " passe level "+(lvl0+1)+" !" )
            })
        }
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
    return (Math.floor((Math.sqrt(xp0 + 172.25) - 12.5) / 4))
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

///////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////XP FUNCTIONS/////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////

module.exports.start = startBot;
