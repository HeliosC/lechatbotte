const tmi = require('tmi.js')

const tmiConfig = require("./config")

const request = require('request')

var redis = require('redis').createClient(process.env.REDIS_URL);
redis.on('connect', function () {
    console.log('connected');
});


let clientID = process.env.clientID
let url = "https://api.twitch.tv/kraken/channels/chatdesbois?client_id="

const cdb = "chatdesbois"
const hdb = "heliosdesbois"
const ldlc = "teamldlc"

const moderators = ["heliosdesbois", "pouidesbois", "chatdesbois", "solis_the_sun"]
const joueursFortnite = ["toxiicdust", "lhotzl", "threshbard", "tutofeeding", "carottounet", "vause", "kraoki"]


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

        if (m.startsWith("sayldlc ") && userstate['display-name'].toLowerCase() == hdb) {
            client.say(ldlc, m.substr(8));
        }
    });

    client.on('chat', (channel, user, message, isSelf) => {
        if (isSelf) return;

        let m = message.toLowerCase()
        let username = user.username

        if( channel.indexOf(ldlc)!=-1  ){
            request('https://api.twitch.tv/kraken/channels/'+ldlc+'?client_id='+process.env.clientID, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    let data = JSON.parse(body)
                    if( data.status.toLowerCase().indexOf(cdb)==-1 ){
                        return;
                    }
                } else {
                    console.error("unable ")
                }
            })
        }

        console.log("LALA ")


        /////////* Specific to chatDesBois's channel *//////////////////////////////////

        if (channel.indexOf(cdb) != -1 || channel.indexOf(ldlc)!=-1) { //return }

            if (username.toLowerCase() != hdb) {

                var answer = ""


                if (/(^|\W)(je|tu)\speu($|\W|t)/gmi.test(m)) {           //   je/tu peux
                    // client.say(channel, username + " peuX, l'orthographe veut ton bien-être !");
                    answer += vide(answer) + "je/tu peuX"
                }

                if (/(^|\W)(il|elle|ont?)\speu($|\W|x)/gmi.test(m)) {               //   on peut
                    // client.say(channel, username + " peuT, l'orthographe veut ton bien-être !");
                    answer += vide(answer) + "on peuT"
                }

                if (/(^|\W)(je|tu)\sveu($|\W|t)/gmi.test(m)) {          //   je/tu veux
                    // client.say(channel, username + " veuX, l'orthographe veut ton bien-être !");
                    answer += vide(answer) + "je/tu veuX"
                }

                if (/(^|\W)(il|elle|ont?)\sveu($|\W|x)/gmi.test(m)) {               //   on veut
                    // client.say(channel, username + " veuT, l'orthographe veut ton bien-être !");
                    answer += vide(answer) + "on veuT"
                }

                if (answer != "") { answer += " , l'orthographe veut ton bien-être !" }

                if (/(^|\W)sa\s?va($|\W)/gmi.test(m)) {                 //   sava
                    // client.say(channel, username + " *ça va, l'orthographe est ton ami, l'ami !");
                    answer += vide(answer) + "*ça va, l'orthographe est ton ami, l'ami !"
                }

                if (/(^|\W)au final($|\W)/gmi.test(m)) {                 //   au final
                    //client.say(channel, username + " *finalement ! Tout doux avec la grammaire ! http://www.academie-francaise.fr/au-final ");
                    answer += vide(answer) + "*finalement ! Tout doux avec la grammaire ! http://www.academie-francaise.fr/au-final ."
                }

                if (/(^|\s)tu\s?(su(sse|se|ce|ss|ç|çe)|susses|suses)(\s|$)/gmi.test(m)) {                 //   au final
                    answer += vide(answer) + "*tu suces"
                }

                if (!isModerateur(username) && /chatt?e\s?(des|dé|de|d)\s?(bois?|boa)/gmi.test(m)) {                 //   chattedesbois
                    redis.lrange('chattedesbois', 0, -1, function (err, reply) {
                        if (reply.indexOf(username) == -1) {
                            // client.say(channel, username + " raté ! C'est \"chat des bois\", c'est pas si dur pourtant :) Next time, j'te goume !");
                            answer += vide(answer) + "raté ! C'est \"chat des bois\", c'est pas si dur pourtant :) Next time, j'te goume !"
                            redis.rpush('chattedesbois', username)
                        } else {
                            client.say(channel, username + " je t'avais prévenu !");
                            client.timeout(channel, username, 5)
                        }
                    });
                }

                //            &&( /(je|ont?)\s(peu.?|).{0,}(duo|squad|skad|jou(|.|..|...))\s?((a|e)ns|ave.\s?toi|\?)/gmi.test(m)  //ON PEUT JOUER ?   |$
                //jou(|.|..|...)


                if (!isModerateur(username) && (joueursFortnite.indexOf(username.toLowerCase()) == -1)
                    && (/(je|ont?).{0,}(duo|squad|skad)\s?((a|e)ns|ave.\s?toi|\?|$)/gmi.test(m)  //ON PEUT JOUER ?   |$
                        || /(je|ont?)\s(peu.?|pourr?ai.?)\s?jou(|er|é|es|e|et)\s?((a|e)ns|ave.\s?(toi|vou|vous)|\?|apr)/gmi.test(m)
                        || /(je|ont?)\s(peu.?|pourr?ai.?)\s?fair.{0,}(parti|gam).{0,}((a|e)ns|ave.\s?(toi|vou|vous)|apr)/gmi.test(m)
                        || /tu.{0,}jou(|.|..)\s?ave.\s?(moi|(t|tes|té|les|lé)\s?(vie|fol|abo))/gmi.test(m)
                        || /tu\s.{0,}(fait|fé|faire|fai|fais|fair)\s.{0,}(des|dé|d).{0,}gam.{0,}(vi(uv|ew|ev|ouv)eu?r|abo)/gmi.test(m)
                        || /can\s?i\s?pl..\s?wi..\s?(you|u)/gmi.test(m)
                    )
                ) {
                    console.log("bite")
                    request(url + clientID, function (error, response, body) {
                        if (!error && response.statusCode == 200) {
                            let data = JSON.parse(body)
                            console.log(data.game)
                            if (data.game.toLowerCase() == "fortnite") {
                                console.log("bite2")
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
                //massacres += 1;
                redis.incr('massacres', function (err, reply) {
                    afficheMassacres(client, channel, parseInt(reply));
                });

            } else if (/^!massacre$/gmi.test(m)) { //*massacres -> affiche le nb
                redis.get('massacres', function (err, reply) {
                    afficheMassacres(client, channel, parseInt(reply));
                });

            } else if (isModerateur(user.username) && /^!massacre \d/gmi.test(m)) {
                massacres = parseInt(m.slice(9 + 1)) || 0;
                afficheMassacres(client, channel, massacres);
                redis.set('massacres', massacres);
            }

            // if (m.startsWith("!game")) {
            //     client.say(channel, "Chatdesbois ne fait pas de games viewers sur Fortnite");
            // }

            if (m.startsWith("arretez")) {
                console.log(channel)
                request('https://tmi.twitch.tv/group/user/' + channel.slice(1) + '/chatters', function (error, response, body) {
                    if (!error && response.statusCode == 200) {
                        let data = JSON.parse(body)
                        let viewers = Object.values(data.chatters).reduce((accumulator, array) => accumulator.concat(array), [])
                        let words = message.split(" ")
                        if (words.length > 0) {
                            let word = words[1]
                            if (isModerateur(username) || (word.toLowerCase() != "policedesbois" && word.toLowerCase() != "heliosdesbois" && viewers.indexOf(word.toLowerCase()) != -1)) {
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


function isModerateur(username) {
    return moderators.indexOf(username.toLowerCase()) != -1;
}

function afficheMassacres(client, channel, massacres) {
    client.say(
        channel,
        `Chatdesbois a massacré ${massacres} pseudo${massacres > 1 ? "s" : ""} en toute impunité ! 👌🏻`
    );

}



function heure() {
    let date = new Date();
    let heure = date.getHours();
    let minutes = date.getMinutes();
    if (minutes < 10) {
        minutes = "0" + minutes;
    }
    return date.getDate() + ":" + (date.getMonth() + 1) + " " + (heure + 1) + "h" + minutes;
}


module.exports.start = startBot;
