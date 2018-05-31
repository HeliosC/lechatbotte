const Discord = require("discord.js")
const client = new Discord.Client()
const { Client, MessageAttachment } = require('discord.js')

const chanIm = "images_videos_trop_lentes"
const chanCh = "cest_ta_vie"
const nombot = "Le Chat Botté"
var nomdon = "🐱Chats de qualité supérieure"
var nomsub = "💕PUTAIN DE CHATONS"
var nommodo = "🐾Chats sous chef"
var nomadmin = "🦄Le Chat en chef"
var tagS = "²"

var Lmin = ["a","b","c","d","e","f","g"]


const fleche = "⬇️       "
const bleu = "🔵       "
const rouge = "🔴       "
const blanc = "⚪️       "
//const l = "🔵🔵🔵🔵🔵🔵🔵\n"
//const l2 = "⚪️⚪️⚪️⚪️⚪️⚪️⚪️\n"
const L = ["🇦", "🇧", "🇨", "🇩", "🇪", "🇫", "🇬"]
var MSG
var jeu = [[blanc, blanc, blanc, blanc, blanc, blanc, blanc], [blanc, blanc, blanc, blanc, blanc, blanc, blanc], [blanc, blanc, blanc, blanc, blanc, blanc, blanc], [blanc, blanc, blanc, blanc, blanc, blanc, blanc], [blanc, blanc, blanc, blanc, blanc, blanc, blanc], [blanc, blanc, blanc, blanc, blanc, blanc, blanc]]
var j1 = true

var areact = false
var IG = false
var joue = false
var msgb = false

client.on('ready', () => { console.log(`Logged in as ${client.user.tag}!`) })

client.on("error", (e) => console.error(e));
client.on("warn", (e) => console.warn(e));
client.on("debug", (e) => console.info(e));

client.on('messageReactionAdd', (reaction, user) => {
    if (user.bot) { return }
    //channel.send(""+reaction)

    if (joue) {
        reaction.remove(user)
        x= L.indexOf( reaction.emoji.toString() ) 
        //MSG.edit("oups")
        y = 5
        while (y >= 0 && jeu[y][x] != blanc) { y -= 1 }
        if (y == -1) {
            console.log("c'est plein")
        } else {
            //console.log(n)
            if (j1) {
                jeu[y][x] = bleu
                j1=false
            }else{
                jeu[y][x] = rouge
                j1=true
            }
            MSG.edit(affiche())
            //console.log(jeu[n][1])


        }
    }

})

client.on('message', msg => {


    if (joue && msg.author.bot && !msgb) {
        MSG = msg
        msgb = true
    }

    if (areact) {
        areact = false
        var n = 0
        A()
        function A() {
            if (n < 7) {
                msg.react(L[n])
                n++
                setTimeout(A, 1000)
            }
        }

        //msg.channel.send((blanc.repeat(7) + "\n").repeat(6))
        msg.channel.send(affiche())
        joue = true
        setTimeout(() => {
            //msg.channel.send("joue")
        }, 7000);

    }

    if (!msg.author.bot) {



        if (msg.content.startsWith("*C4") && !IG) {

            msg.channel.send(fleche.repeat(7))
            areact = true

            IG = true
        }

    }



})



function affiche() {
    tab = ""
    for (var x of jeu) {
        for (var y of x) {
            tab += y
        }
        tab += "\n"
    }
    return (tab)
}



client.login(process.env.TOKENchat);
