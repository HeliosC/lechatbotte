const food = require('./bddquiz/food.js')
const terre = require('./bddquiz/terre.js')
const chat = require('./bddquiz/chat.js')
const q2017 = require('./bddquiz/2017.js')
const genre = require('./bddquiz/genre.js')
const quebec = require('./bddquiz/quebec.js')
const motrigolo = require('./bddquiz/motrigolo.js')

const themes = ["food", "terre", "chat", "2017", "genre", "quebec", "motrigolo"]
const questions = [food, terre, chat, q2017, genre, quebec, motrigolo]
const nbq = [100, 50, 50, 26, 50, 26, 26]


var chanJeux, client, nomadmin, nommodo

//const s = chat.str
//const s = questions[2]


//const s = food.str
//const n = s.length

var quest, rep, MSGa, joueur, q, I
areact = false
accept = false

jmodo = false

var message = function (msg) {
    //client.on('message', msg => {
    /*try {
        let modo = msg.member.roles.has(msg.guild.roles.find("name", nommodo).id);
        let admin = msg.member.roles.has(msg.guild.roles.find("name", nomadmin).id);
    }
    catch (error) {
        modo = false
        admin = false
        //console.log(error)
    }*/

    admin = false; modo = false;
    if (msg.guild.roles.find("name", nommodo) != null) {
       modo = msg.member.roles.has(msg.guild.roles.find("name", nommodo).id);
       admin = msg.member.roles.has(msg.guild.roles.find("name", nomadmin).id);
    } 


    if (msg.channel.name.indexOf(chanJeux) != -1 || admin || modo) {
        if (msg.content.toLowerCase().startsWith("*qq") || msg.content.toLowerCase().startsWith("*quipoquiz")) {


            if (msg.content.toLowerCase().substr(4) == "themes" || msg.content.toLowerCase().substr(4) == "?") {
                themeslist(msg.channel)
            } else {
                I = themes.indexOf(msg.content.toLowerCase().substr(4))

                if (I == -1) {
                    I = rd(0, themes.length - 1)
                }
                //console.log(I)

                var p = questions[2].str

                //console.log(p.substr(2, 10))


                q = Q(I, rd(1, nbq[I]))
                quest = q[0]
                rep = q[1]
                //[quest, rep] = Q(2,rd())//Q(questions[I],rd())
                joueur = msg.author
                msg.channel.send({ embed: { color: 3447003, description: joueur + " [Thème : " + themes[I] + "]\n" + quest } })
                areact = true

                jmodo = (admin || modo)

            }
        }
    }

    if (msg.channel.name.indexOf(chanJeux) != -1 || jmodo) {

        if (areact && msg.author.bot) {
            jmodo = false

            areact = false
            MSGa = msg
            var h = client.emojis.find("name", "yea");
            msg.react(h)
            setTimeout(() => {
                var h = client.emojis.find("name", "nay");
                msg.react(h)
            }, 500);

            accept = true

        }

    }

}//)

//client.on('messageReactionAdd', (reaction, user) => {
var messageReactionAdd = function (reaction, user) {

    if (accept && MSGa.id == reaction.message.id) {
        if (user == joueur) {
            if (reaction.emoji.name == "yea") {
                var mes
                if (rep[15] == "V") {
                    mes = "GAGNE"
                } else {
                    mes = "PERDU"
                }
                //MSGa.edit({ embed: { color: 3447003, description: joueur + "\n" + quest + "\n" + " " + "\n" + mes + "\n" + rep } })
                MSGa.edit({ embed: { color: 3447003, description: joueur + " [Thème : " + themes[I] + "]\n" + quest + "\n" + " " + "\n" + mes + "\n" + rep } })
                //reaction.message.channel.send({ embed: { color: 3447003, description: mes+"\n"+rep } })         
                //reaction.message.channel.send(MSGa.content)
                //MSGa.embed.description("rer")

            }
            if (reaction.emoji.name == "nay") {
                if (rep[15] == "F") {
                    mes = "GAGNE"
                } else {
                    mes = "PERDU"
                }
                MSGa.edit({ embed: { color: 3447003, description: joueur + " [Thème : " + themes[I] + "]\n" + quest + "\n" + " " + "\n" + mes + "\n" + rep } })
            }

            accept = false
        }
    }

    //messageReactionAdd(reaction, user)
}//)



//[quest,rep] = Q(rd())

//console.log(quest)

/*var message = function(msg){

    if(msg.content.to)
}

var messageReactionAdd = function(reaction, user){
    
}/*


/*for(r=0;r<100;r++){
    //console.log(r)
    console.log(s[r])

    //console.log(l(r))
}*/

//Q(1)

/*for (r = 1; r < 11; r++) {
    Q(r)
}*/

//Q(10)




function Q(I, ent) {

    var s = questions[I].str

    var t = "(" + ent + ")"
    var t1 = "(" + (ent + 1) + ")"
    var tr = "(R)"
    var tn = ent.toString().length + 2
    var tn1 = (ent + 1).toString().length + 2

    var m = 0
    while (s.substr(m, tn) != t) {
        m++
    }
    var D = m
    while (s.substr(m, 3) != tr) {
        m++
    }
    var F = m

    //console.log(s.substr(D + 3 + tn, F - D - 3 - tn))
    quest = s.substr(D + 3 + tn, F - D - 3 - tn)

    var D = m

    while (s.substr(m, tn1) != t1) {
        m++
    }
    var F = m

    //console.log(s.substr(D + 3 , F - D -3))
    rep = s.substr(D + 3, F - D - 3)
    //console.log(quest)
    //console.log(rep)

    //console.log("("+ent+")")
    //console.log(ent.toString().length)
    /*var nb = 0
    var i = 0
    while (nb < ent) {
        if (s[i] == '\n'){
            nb=nb+1
        }
    }
    return(i)*/


    return ([quest, rep])
}

function themeslist(ch) {
    var st = "Liste des themes :\n"
    for (a of themes) {
        st = st + " - " + a + "\n"
    }
    ch.send({ embed: { color: 3447003, description: st } })
}

function rd(min = 1, max = 25) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

var setParam = function (Mclient, MchanJeux, Mnomadmin, Mnommodo) {
    client = Mclient
    chanJeux = MchanJeux
    nomadmin = Mnomadmin
    nommodo = Mnommodo
}

exports.message = message
exports.messageReactionAdd = messageReactionAdd
exports.setParam = setParam
