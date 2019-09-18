//const tmi = require('tmi.js')

//const tmiConfig = require("./config")


var allBotCommands = ["!-honte", "!honte", "!stathonte", "!massacre+1", "!massacre", "!massacres+1", "!massacres", "!mort", "!morts", "!mort+1", "!morts+1", "!lobby", "!lobby+1", "!lobby-1", "!loby", "!loby+1", "!loby-1", "arretez",
"!mtop", "!topm", "!topmensuel", "!mensuel", "!top",
"!gtop", "!topg", "!topglobal", "!global",
"!mlvl", "mlevel", "!lvlm", "!lvlmensuel", "!levelm", "!levelmensuel", "!level", "!lvl",
"!glvl", "glevel", "!lvlg", "!lvlglobal", "!levelg", "!levelglobal",
"!mxp", "!xpm", "!xpmensuel", "!xp",
"!gxp", "!xpg", "!xpglobal"]

var descriptableCommands = ["!honte", "!stathonte", "!massacre+1", "!mort+1", "!lobby+1",
"!top", "!topg", "!lvl", "!lvlg", "!xp", "!xpg"]

 var counterCommands = ["!masacre", "!lobby", "!mort"]

 var pasFaite = ["!fc", "!follow",
 "!lastgame?",
 "!viewers???"]

// var redis = require('redis').createClient("redis://h:p8c68d0e7f47095a44f5b697ca26701acbd511ff4868cadae2edec441649dac5f@ec2-3-248-103-243.eu-west-1.compute.amazonaws.com:32109");
// redis.on('connect', function () {
//     console.log('redis connected');
// });




//let clientID = process.env.clientID


//let client = new tmi.client(tmiConfig);
//client.connect().then(console.log("twitch connected"))


const moderators = ["heliosdesbois", "pouidesbois", "chatdesbois", "solis_the_sun"]



//client.on('chat', (channel, user, message, isSelf) => {

function chat(channel, user, message, isSelf, redis){

    let m = message.toLowerCase();
    let username = user.username;

    var args = message.split(" ")
    if(isModerateur(username)){
        if(args[0] == "!police"){
            if(["add", "edit", "remove"].includes(args[1]) && allBotCommands.includes(args[2])){
                client.say(channel, "Cette commande n'est pas modifiable.")
                return
            }
            switch (args[1]){
                case "add":
                    redis.hexists("commands", args[2], (err, exists) => {
                        if(exists){
                            client.say(channel, "Cette commande existe déjà.")
                        }else if(args[3]!=null && args[3]!=undefined){
                            redis.hset("commands", args[2], args.slice(3).join(" "), (err, reply) => {
                                client.say(channel, "Commande "+ args[2] + " crée.")
                            })
                        }
                    })
                    break
                case "edit":
                    redis.hexists("commands", args[2], (err, exists) => {
                        if(!exists){
                            client.say(channel, "Cette commande n'existe pas.")
                        }else if(args[3]!=null && args[3]!=undefined){
                            redis.hset("commands", args[2], args.slice(3).join(" "), (err, reply) => {
                                client.say(channel, "Commande "+ args[2] + " modifiée.")
                            })
                        }else{
                        }
                    })
                    break
                case "remove":
                    redis.hexists("commands", args[2], (err, exists) => {
                        if(!exists){
                            client.say(channel, "Cette commande n'existe pas.")
                        }else{
                            redis.hdel("commands", args[2], (err, reply) => {
                                client.say(channel, "Commande "+ args[2] + " supprimée.")
                            })
                        }
                    })
                    break
                case "description":
                    if(descriptableCommands.includes(args[2])){
                        if(args[3]==null || args[3]==undefined){
                            args[3] = " ";
                        }
                        redis.hset("commands/description", args[2], args.slice(3).join(" "), (err, reply) => {
                            client.say(channel, "Description de la commande "+ args[2] + " modifiée.")
                        })
                    }else{
                        client.say(channel, "Impossible d'ajouter une description à cette commande.")
                    }
                    break
                
            }
        }
    }
    
    //if(m.startsWith("!") && !m.startsWith("!commands")){
    let command = args[0]
    // redis.hkeys("commands", (err, keys) => {
    //     if(!err){
    //         if(keys.includes(command)){
    //             //console.log("oui")

    //         }
    //     }
    // })
    redis.hget("commands", command, (err, reply) => {
        if(reply!=null){
            client.say(channel, reply)
        }
    })
    //}
//})
}



function isModerateur(username) {
    return moderators.indexOf(username.toLowerCase()) != -1;
}

exports.chat = chat