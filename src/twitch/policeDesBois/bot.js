const tmi = require('tmi.js')

const tmiConfig = require("./config")

//const request = require('request')

var api = require('twitch-api-v5')
api.clientID = process.env.clientID

// var redis = require('redis').createClient(process.env.REDIS_URL);
// redis.on('connect', function () {
//     console.log('redis connected');
// });

const apitwitch = require('./api_twitch.js')

const commandManager = require('./command_manager.js')

const {google} = require('googleapis')

const googleClient = new google.auth.JWT(
    process.env.GAPI_email,
    null,
    process.env.GAPI_private_key.replace(/\\n/g, '\n'),
    ['https://www.googleapis.com/auth/spreadsheets']
);


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
const honteurs = ["heliosdesbois", "pouidesbois", "chatdesbois", "kraoki", "hotzdesbois", "aryus80"]

//request(url + IDchatdesbois + "?client_id=" + clientID, function (error, response, body) {

const ete = 2

var massacresON = true
var lobbiesON = true
var mortsON = true
var cannonsON = true

const xptimer = 60000
const ontest = false
const xpacitf = true
var active = false
var chaters = {}
var intervalObject
var timerClip
// var timerTest
// var timerTest2
var isCached = {}

var idchatdesbois = "122699636"
var idldlc = "42255745"



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

// followers=4709

// function onFollow(client){
//     request('https://api.twitch.tv/kraken/channels/' + cdb + '?client_id=' + process.env.clientID, function (error, response, body) {
//         if (!error && response.statusCode == 200) {
//             let data = JSON.parse(body);
//             if(followers<data.followers){
//                 followers=data.followers
//                 client.say(cdb,'Plus que '+(5000-parseInt(data.followers))+' followers avant les 5k ! ')
//             }
//         }
//     })
// }

var redis

function startBot(redisClient) {

    redis = redisClient

    apitwitch.start()
    //GetAllAnalytics()
    //GetViewersAnalytics()


    let client = new tmi.client(tmiConfig);
    client.connect().then(_ => {
        console.log(`${tmiConfig.identity.username} logged in on twitch !`)
        client.whisper(hdb, "Deployed: " + heure());

        // client.say(cdb,'/me test')
        // request('https://api.twitch.tv/kraken/channels/' + cdb + '?client_id=' + process.env.clientID, (error, response, body) => {
        //     if (!error && response.statusCode == 200) {
        //         let data = JSON.parse(body);
        //         followers = data.followers
        //         intervalObject = setInterval(_=>{
        //                 onFollow(client)
        //         }, 30000);
        //     }
        // })

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
            //GetAllAnalytics()
            //GetViewersAnalytics()
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

        // if(isSelf){
        //     console.log("self")
        //     return
        // }



        // if (channel.indexOf(ldlc) != -1) {
        //     request('https://api.twitch.tv/kraken/channels/' + IDldlc + '?client_id=' + process.env.clientID, function (error, response, body) {
        //         if (!error && response.statusCode == 200) {
        //             let data = JSON.parse(body);
        //             if (data.status.toLowerCase().indexOf(cdb) != -1 || data.status.toLowerCase().indexOf(cdb2) != -1) {
        //                 channelCdb(client, channel, user, message, isSelf, idldlc);
        //             }
        //         } else {
        //             console.error("unable ");
        //         }
        //     })
        // } else {
            channelCdb(client, channel, user, message, isSelf, idchatdesbois);
        // }
//         else if (channel.indexOf(cdg) != -1) {


//             request('https://api.twitch.tv/kraken/channels/' + cdg + '?client_id=' + process.env.clientID, function (error, response, body) {
//                 if (!error && response.statusCode == 200) {
//                     let data = JSON.parse(body);
//                     if (data.status.toLowerCase().indexOf(cdb) != -1 || data.status.toLowerCase().indexOf(cdb2) != -1) {
//                         channelCdb(client, channel, user, message, isSelf);
//                     }else{
//                     }
//                 } else {
//                     console.error("unable ");
//                 }
//             })
//         } else {
//             channelCdb(client, channel, user, message, isSelf);
//         }
//     });
    })
}

/////////* Specific to chatDesBois's channel *//////////////////////////////////

//if (channel.indexOf(cdb) != -1 || channel.indexOf(ldlc)!=-1) { //return }

function channelCdb(client, channel, user, message, isSelf, IDchatdesbois) {

    commandManager.chat(channel, user, message, isSelf, client, redis)

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

    //if (username.toLowerCase() != hdb && !isBoss(username)) {
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
            //request(url + IDchatdesbois + "?client_id=" + clientID, function (error, response, body) {
            //    if (!error && response.statusCode == 200) {

            api.streams.channel({ channelID: idchatdesbois }, (err, res) => {
                if(!err) {
                    //let data = JSON.parse(body)
                    //console.log(data.game)
                    if (res.stream.game.toLowerCase() == "fortnite") {
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

    } // FIN !isBoss

    //J'dirais pas qu'il ait de bonnes ou de mauvaises situations... Mais j'pense quand même que mes games de placement le sont : >> https://www.youtube.com/watch?v=km6DxSc_d1s&t=1s <<
    if (
        //!isModerateur(username) && 
        //(username!="nightbot") &&
        //false &&
    //(
        (!isBoss(username) && (
            /((c'?est|cé?|ces)|(t|tes|t'est?|tu est?|t'? ?étais?|t'? ?été)) (k|qu)ell?e? (elo|élo|rank)/gmi.test(m)  //ELO ?   |$
        || /(c'?est|cé?|ces) (qu|k)oi (le |l'? ?)(elo|élo|rank)/gmi.test(m)
        || /(on est?|vous? .tes?) (sur|a|à) (k|qu)ell?e? (elo|élo|rank)/gmi.test(m)
        || /(k|qu)ell?e? (elo|élo|rank) ?\?/gmi.test(m)
        ))
        || /^!(elo|élo|rank) ?$/gmi.test(m)
    //)
    ) {

        //client.whisper(hdb, m)
        
        //request(url + IDchatdesbois + "?client_id=" + clientID, function (error, response, body) {
        //if (!error && response.statusCode == 200) {
        //        let data = JSON.parse(body)

        api.streams.channel({ channelID: idchatdesbois }, (err, res) => {
            if(!err) {
                if (res.stream.game.toLowerCase() == "league of legends") {
                    console.log("ok league")
                    client.say(channel, username + ", l'important c'est pas l'élo c'est comment on joue! Je joue depuis la S1 et j'ai pas encore try hard les rankeds donc pas d'elo! Ça va de l'iron aux dieux vivants!")
                    //client.say(channel, "L'important c'est pas l'élo c'est comment on joue! Je joue depuis la S1 et j'ai pas encore try hard les rankeds donc pas d'elo! Ça va de l'iron aux dieux vivants!")
                }
            }
            else {
                console.error("unable league")
            }
        })
    }else{
        //console.log("nope")
    }




    if ( m.startsWith("!-honte") ){
        newHonteux = m.split(" ")[1]
        if(isHonteur(username) && newHonteux != undefined){
            redis.hget("ranking/id", newHonteux, function(err, newHonteuxID){
                console.log(newHonteuxID)
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
            // request('https://tmi.twitch.tv/group/user/' + channel.slice(1) + '/chatters', function (error, response, body) {
            //     if (!error && response.statusCode == 200) {
            //         let data = JSON.parse(body)
            //         let viewers = Object.values(data.chatters).reduce((accumulator, array) => accumulator.concat(array), [])

                    redis.get("honte/user", function(err, honteuxID){
                        if(!err && honteuxID != null){
                            redis.get("honte/actuel", function(err, time){
                                redis.hget("ranking/username", honteuxID, function(err, honteux){
                                    redis.hget("ranking/id", newHonteux, function(err, newHonteuxID){
                                        if(newHonteuxID != null){
                                            redis.hget("ranking/username", newHonteuxID, function(err, newHonteux){
                                                if(honteuxID != "null"){
                                                    // if (viewers.indexOf(newHonteux.toLowerCase()) != -1){
                                                    client.say(channel, 
                                                    // "Après " + time + " minute" + (parseInt(time)>1? "s " : " ") + 
                                                    honteux + " passe le bâton de la honte à " + newHonteux)
                                                    // }else{
                                                        //     client.say(channel, "Le bâton de la honte est fièrement porté par " + honteux
                                                        //     + " depuis " + time + " minute" + (parseInt(time)>1? "s " : " ") 
                                                        //     )
                                                        // }
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
                // } else {
                //     console.error("unable ")
                // }
            // })
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
        // if(honteux != undefined){
            redis.hexists("ranking/id", honteux, function(err, exists){
                if(exists){
                    console.log(honteux)
                    redis.hget("ranking/id", honteux, function(err, honteuxID){
                        console.log(honteuxID)
                        redis.hget("ranking/username", honteuxID, function(err, honteux){
                            console.log(honteux)
                            redis.zscore("honte/nombres", honteuxID, function(err, nombre){
                                if(nombre != null){
                                    redis.zscore("honte/temps", honteuxID, function(err,  temps){
                                        // redis.zscore("honte/nombres", honteuxID, function(err,  nombre){
                                            client.say(channel, honteux + " : " + nombre + " bâton" + (parseInt(nombre)>1? "s" : "") + " / "
                                             + (temps==undefined? 0 : temps) + " minute" + (parseInt(temps)>1? "s" : "") + " de honte à son actif" )
                                        // })
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

            // redis.hexists("honte/nombres", honteux, function(err, exists){
            //     if(exists){
            //         redis.hget("ranking/id", honteux, function(err, honteuxID){
            //             redis.hget("ranking/username", honteuxID, function(err,  honteux){
            //                 redis.hget("honte/temps", honteuxID, function(err,  temps){
            //                     redis.hget("honte/nombres", honteuxID, function(err,  nombre){
            //                         client.say(channel, honteux + " : " + nombre + " bâton" + (parseInt(nombre)>1? "s" : "") + " / "
            //                          + temps + " minute" + (parseInt(temps)>1? "s" : "") + " de honte à son actif" )
            //                     })
            //                 })
            //             })  
            //         })

            //     }else{
            //         redis.hexists("ranking/id", honteux, function(err, exists){
            //             if(exists){
            //                 redis.hget("ranking/id", honteux, function(err, honteuxID){
            //                     redis.hget("ranking/username", honteuxID, function(err, honteux){
            //                         client.say(channel, honteux + " n'a pas encore connu la honte")
            //                     })
            //                 })
            //             }else{
            //                 client.say(channel, honteux + " est inconnu au bataillon de la honte")
            //             }
            //         })
            //     }
            // })

        // }
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


    if (/^!morts?\s?\+\s?1$/gmi.test(m) || /^!lobb?y\s?\+\s?1$/gmi.test(m) || /^!cann?ons?\+\s?1$/gmi.test(m) ) {

        //request(url + IDchatdesbois + "?client_id=" + clientID, function (error, response, body) {
        //    if (!error && response.statusCode == 200) {
        //        let data = JSON.parse(body)

        api.streams.channel({ channelID: idchatdesbois }, (err, res) => {
            if(!err) {
                if ( (res.stream.game.toLowerCase().indexOf("tomb raider") != -1) || (res.stream.game.toLowerCase().indexOf("lara croft") != -1) ) {
                    
                    if (/^!morts?\s?\+\s?1$/gmi.test(m) && mortsON) { //*morts? -> incremente
                        mortsON = false
                        setTimeout(function () {
                            mortsON = true
                        }, 15000); 
                        
                        redis.incr('morts', function (err, reply) {
                            afficheMorts(client, channel, parseInt(reply));
                        });
                
                    }

                }else if (res.stream.game.toLowerCase() == "fortnite") {

                    if (/^!lobb?y\s?\+\s?1$/gmi.test(m) && lobbiesON) { //*lobby -> incremente
                        lobbiesON = false
                        setTimeout(function () {
                            lobbiesON = true
                        }, 30000); 
                
                        redis.incr('lobbies', function (err, reply) {
                            afficheLobbies(client, channel, parseInt(reply));
                        });
                
                    }

                }else if (res.stream.game.toLowerCase() == "league of legends") {

                    if (/^!cann?ons?\+\s?1$/gmi.test(m) && cannonsON) { //*cannons -> incremente
                        cannonsON = false
                        setTimeout(function () {
                            cannonsON = true
                        }, 30000); 
                
                        redis.incr('cannons', function (err, reply) {
                            afficheCannons(client, channel, parseInt(reply));
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



    if (/^!cann?ons?$/gmi.test(m)) { //*cannons -> affiche le nb
        redis.get('cannons', function (err, reply) {
            afficheCannons(client, channel, parseInt(reply));
        });

    } else if (isModerateur(user.username) && /^!cann?ons?\s?\-\s?1$/gmi.test(m)) {
        redis.decr('cannons', function (err, reply) {
            afficheCannons(client, channel, parseInt(reply));
        });
    }
    else if (isModerateur(user.username) && /^!cannons \d/gmi.test(m)) {
        cannons = parseInt(m.slice(7 + 1)) || 0;
        afficheCannons(client, channel, cannons);
        redis.set('cannons', cannons);
    }

    
    if (m.startsWith("arretez")) {
        //console.log(channel)
        //request('https://tmi.twitch.tv/group/user/' + channel.slice(1) + '/chatters', function (error, response, body) {
        //    if (!error && response.statusCode == 200) {
        //        let data = JSON.parse(body)

        api.other.chatters({channelName: channel.slice(1)}, (err, res) => {
            if(!err){
                let viewers = Object.values(res.chatters).reduce((accumulator, array) => accumulator.concat(array), [])
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
//////////////////////////////XP SYSTEM///////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////

    // console.log(username, userid)
    if(userid!=undefined && username!=cdb && username!='nightbot'){
        if(isCached[userid]!=true){
            isCached[userid]=true
            //ALLO TWITCH
            api.users.userByID({ userID: userid }, (err, res) => {
                if(!err) {
                    redis.hset('ranking/logo', userid, res.logo)
                    redis.hset('ranking/username',userid, user['display-name'])
                    redis.hset('ranking/color', userid, user.color)
                    redis.hset('ranking/id', username, userid)
                }
            })
        }
        chaters[userid] = 10
    }

    if (!active) {
        //request('https://api.twitch.tv/kraken/streams/' + IDchatdesbois + '?client_id=' + clientID,  (error, response, body) => {
        //    if (!error && response.statusCode == 200) {
        //        let data = JSON.parse(body)

        api.streams.channel({ channelID: idchatdesbois }, (err, res) => {
            if(!err) {
                //Live on ???
                if ( (res.stream != null || ontest)&&xpacitf) {
                    console.log("LIVE ONNNNNNNNNNNNNNNNNNNN")
                    active = true
                    intervalObject = setInterval(()=>{
                        updateXp(client, IDchatdesbois)
                    }, xptimer);

                    timerClip = setInterval(()=>{
                        // console.log("timerClip")
                        client.say(channel, "Hésite pas à clipper un max de moments pendant le stream ! Éternuements, rires, danses, racontages de vie, tout est bon !")
                    }, 15*60000);

                    // timerTest = setInterval(()=>{
                    //     console.log("timerTest")
                    // }, 60000);

                    // timerTest2 = setInterval(()=>{
                    //     console.log("timerTest2")
                    // }, 2*60000);

                } else {
                }
            } else {
                console.error("unable ")
            }
        })
    }

    if(xpacitf && !ontest){
        // if (/^!(mtop|top(m|mensuel))$/gmi.test(m)) {
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

}//fin if channel cdb





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

function afficheCannons(client, channel, cannons) {
    client.say(
        channel,
        `${cannons} cannons ont étés ratés`
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
    //Qui est devant toi dans le classement ' + classement + '? Des genoux à casser ? La réponse ici : >>> '
    // +'chatdesbois.herokuapp.com/'+top
    //+'http://top.chatdesbois.stream/'+top
    //+' <<<')
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



    //request('https://api.twitch.tv/kraken/streams/' + IDchatdesbois + '?client_id=' + clientID, function (error, response, body) {
    //    if (!error && response.statusCode == 200) {
    //        let data = JSON.parse(body)

    if(false){
        api.streams.channel({ channelID: idchatdesbois }, (err, res) => {
            if(!err) {
                if(res.stream != null){

                    
                    var viewers = res.stream.viewers
                    // var [annee, mois, jour] = dateFullSplited()
                    var date = dateFullHours()
                    date.jour+=0
                    // console.log(viewers)
        
                    redis.hset(`analytics/${cdb}/viewersEvolution`, `${date.day}/${date.month}/${date.year} ${date.hours}:${date.minutes}`, viewers)
        
        
                    googleClient.authorize(function(err,tokens){
                        if(err){
                            console.log(err);
                            throw err;
                        }
                        // return 
                        const gsapi = google.sheets({version:'v4', auth: googleClient});
                    
                        var updateOpt = {
                            spreadsheetId: process.env.SheetAnalytics,
                            range: "Evolution!A:B",
                            valueInputOption: 'USER_ENTERED',
                            resource : {
                                majorDimension: "ROWS",
                                values: [[`${date.day}/${date.month}/${date.year} ${date.hours}:${date.minutes}`, viewers]]
                            }
                        };
                        // await 
                        gsapi.spreadsheets.values.append(updateOpt)
                    
                    });
        
        
                    redis.hincrby(`analytics/${cdb}/${date.year}/${date.month}/${date.day}`, "stream_duration", 1, function(err, stream_duration){
                        redis.hincrby(`analytics/${cdb}/${date.year}/${date.month}/${date.day}`, "total_viewers", viewers, function(err, total_viewers){
                            redis.hget(`analytics/${cdb}/${date.year}/${date.month}/${date.day}`, "max_viewers", function(err, max_viewers){
                                if(max_viewers == undefined || max_viewers < viewers){
                                    redis.hset(`analytics/${cdb}/${date.year}/${date.month}/${date.day}`, "max_viewers", viewers)
                                }
                                redis.hmset(`analytics/${cdb}/${date.year}/${date.month}/${date.day}`, "followers", data.stream.channel.followers, "views", data.stream.channel.views)
                            })
                        })
                    })
                    redis.hincrby(`analytics/${cdb}/monthly/${date.year}/${date.month}`, "stream_duration", 1, function(err, stream_duration){
                        redis.hincrby(`analytics/${cdb}/monthly/${date.year}/${date.month}`, "total_viewers", data.stream.viewers, function(err, total_viewers){
                            redis.hget(`analytics/${cdb}/monthly/${date.year}/${date.month}`, "max_viewers", function(err, max_viewers){
                                if(max_viewers == undefined || max_viewers < viewers){
                                    redis.hset(`analytics/${cdb}/monthly/${date.year}/${date.month}`, "max_viewers", viewers)
                                }
                                redis.hmset(`analytics/${cdb}/monthly/${date.year}/${date.month}`, "followers", data.stream.channel.followers, "views", data.stream.channel.views)
                            })
                        })
                    })


                }
            }
        })

    }

    if(xpacitf){
        redis.get("honte/user", function(err, honteuxID){
            redis.zincrby("honte/temps", 1, honteuxID)
        })
    redis.get("honte/actuel", function(err, time){
            redis.set("honte/actuel", ""+(parseInt(time)+1) )
        })
    }

    console.log("chaters: "+chaters)

    for (var userid in chaters) {
        chaters[userid] -= 1
        if (chaters[userid] == 0) {
            delete chaters[userid]
        }
        date = dateXp()
        xpgain = randInt(4, 5)
        if(xpacitf && !ontest){
            checkLevelUp(client, userid, xpgain, date)
        }
    //    redis.zincrby('ranking/xp/' + date, xpgain, userid)
    //    redis.zincrby('ranking/xp/global', xpgain, userid)
    }
    //request('https://api.twitch.tv/kraken/streams/' + IDchatdesbois + '?client_id=' + clientID, function (error, response, body) {
    //    if (!error && response.statusCode == 200) {
    //        let data = JSON.parse(body)

    api.streams.channel({ channelID: idchatdesbois }, (err, res) => {
        if(!err) {
            //Live off ???
            if (res.stream == null && !ontest) {
                active = false
                clearTimeout(intervalObject)
                clearTimeout(timerClip)
                // clearTimeout(timerTest)
                // clearTimeout(timerTest2)
                redis.set("honte/user", "null")
                    console.log("LIVE OFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF")
            } else {
            }
        } else {
            console.error("unable ")
        }
    })
}

function checkLevelUp(client, userid, xpgain, date){

    // console.log("CHECK LEVEL UP "+userid)

    redis.zscore('ranking/xp/'+ date, userid, (err, score)=>{
        var score=parseInt(score)
        var lvl=level(score)

        redis.zscore('ranking/xp/global', userid, (err, score0)=>{
            var score0=parseInt(score0)
            var lvl0=level(score0)

            var upm = (score + xpgain >= xp(lvl + 1))
            var upg = (score0 + xpgain >= xp(lvl0 + 1))

            // console.log("score: "+score+" level: "+lvl+" xpgain: "+xpgain+" xp next level: "+xp(lvl + 1)+" booleen: "+upm)
            // console.log("score0: "+score0+" level0: "+lvl0+" xpgain: "+xpgain+" xp next level0: "+xp(lvl0 + 1)+" booleen: "+upg)

            if(upg){
                redis.hget('ranking/username', userid, (err, username)=>{
                    //client.say(cdb, '/me '+username + " passe level "+(lvl0+1)+" !" )
                    //if(!upm){
                    if(lvl0 == 0 || (lvl0>0 && (lvl0+1)%2 == 1) || lvl0>8 ){
                        client.whisper(username.toLowerCase(), "Level global up chez Chatdesbois ! -> Lvl "+(lvl0+1) )
                    }
                    //}
                    //client.say(cdb, username + " passe level "+(lvl0+1)+" ! (global)" )
                    chatlog("policedesbois", '/me '+username + " passe level "+(lvl0+1)+" ! (global)" )
                })
            }
            if(upm){
                redis.hget('ranking/username', userid, (err, username)=>{
                    // client.whisper(username, "Level mensuel up chez Chatdesbois ! -> Lvl "+(lvl+1) )
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

    // console.log({year, month, day, hours, minutes})

        return {year, month, day, hours, minutes}
}

///////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////XP FUNCTIONS/////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////

function GetAllAnalytics(){
    // return new Promise( (resolve, reject) => {
    promises = []

        // data = []
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
        // console.log("pro", promises)
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

            // console.log("data", res2)
            
            googleClient.authorize(function(err,tokens){
                if(err){
                    console.log(err);
                    throw err;
                }
                // return 
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
                // await 
                gsapi.spreadsheets.values.update(updateOpt)
            
            });
        
        })
        // console.log("allo?")
    // })

}

function getAnalytics(annee, mois, jour){
    return new Promise( (resolve, reject) => {

    redis.exists(`analytics/${cdb}/${annee}/${mois}/${jour}`, function(err, exists){
        // console.log(`analytics/${cdb}/${annee}/${mois}/${jour}`)
        if(exists){
            redis.hvals(`analytics/${cdb}/${annee}/${mois}/${jour}`, function(err, reply){
                // data.push(reply)
                // return reply
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
        // console.log("res", res)
        if(!err && res != null){
            // for(i=0; i<res.length; i+=2){
            //     data.push([res[i], res[i+1]])
            // }

            for (let [key, value] of Object.entries(res)) {
                data.push([key, value]);
            }
            
            googleClient.authorize(function(err,tokens){
                if(err){
                    console.log(err);
                    throw err;
                }
                // return 
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
                // await 
                gsapi.spreadsheets.values.update(updateOpt)
        
            });

        }

    })
}

module.exports.start = startBot;

