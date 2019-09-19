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

var usedCommands = []


//let clientID = process.env.clientID


//let client = new tmi.client(tmiConfig);
//client.connect().then(console.log("twitch connected"))


const moderators = ["heliosdesbois", "pouidesbois", "chatdesbois", "solis_the_sun"]



//client.on('chat', (channel, user, message, isSelf) => {

function chat(channel, user, message, isSelf, client, redis){

    let m = message.toLowerCase();
    let username = user.username;

    var args = message.split(" ")
    if(isModerateur(username)){
        if(args[0] == "!police"){
            var command = args[2].toLowerCase()
            if(["add", "edit", "remove"].includes(args[1]) && allBotCommands.includes(command)){
                client.say(channel, "Cette commande n'est pas modifiable.")
                return
            }
            switch (args[1]){
                case "add":
                    redis.hexists("commands", command, (err, exists) => {
                        if(exists){
                            client.say(channel, "Cette commande existe déjà.")
                        }else if(args[3]!=null && args[3]!=undefined){
                            redis.hset("commands", command, args.slice(3).join(" "), (err, reply) => {
                                client.say(channel, "Commande "+ command + " crée.")
                            })
                        }
                    })
                    break
                case "edit":
                    redis.hexists("commands", command, (err, exists) => {
                        if(!exists){
                            client.say(channel, "Cette commande n'existe pas.")
                        }else if(args[3]!=null && args[3]!=undefined){
                            redis.hset("commands", command, args.slice(3).join(" "), (err, reply) => {
                                client.say(channel, "Commande "+ command + " modifiée.")
                            })
                        }else{
                        }
                    })
                    break
                case "remove":
                    redis.hexists("commands", command, (err, exists) => {
                        if(!exists){
                            client.say(channel, "Cette commande n'existe pas.")
                        }else{
                            redis.hdel("commands", command, (err, reply) => {
                                client.say(channel, "Commande "+ command + " supprimée.")
                            })
                        }
                    })
                    break
                case "description":
                    if(descriptableCommands.includes(command)){
                        if(args[3]==null || args[3]==undefined){
                            args[3] = " ";
                        }
                        redis.hset("commands/description", command, args.slice(3).join(" "), (err, reply) => {
                            client.say(channel, "Description de la commande "+ command + " modifiée.")
                        })
                    }else{
                        client.say(channel, "Impossible d'ajouter une description à cette commande.")
                    }
                    break
                
            }
        }
    }
    
    //if(m.startsWith("!") && !m.startsWith("!commands")){
    var testCommand = args[0].toLowerCase()
    // redis.hkeys("commands", (err, keys) => {
    //     if(!err){
    //         if(keys.includes(command)){
    //             //console.log("oui")

    //         }
    //     }
    // })
    redis.hget("commands", testCommand, (err, reply) => {
        if(reply!=null && !usedCommands.includes(testCommand)){
            client.say(channel, reply)
            usedCommands.push(testCommand)
            console.log("avant slice "+testCommand+ " / "+usedCommands)
            setTimeout(function() { updateCommands(testCommand) }, 10000);
        }
    })

    //}
//})
}

function updateCommands(removedCommand){
    console.log("slice "+removedCommand + " / "+usedCommands + " / " + usedCommands.indexOf(removedCommand))
    usedCommands.splice(usedCommands.indexOf(removedCommand),1)
    console.log("apres slice "+removedCommand + " / "+usedCommands)
}


function isModerateur(username) {
    return moderators.indexOf(username.toLowerCase()) != -1;
}

exports.chat = chat