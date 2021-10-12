var allBotCommands = ["!-honte", "!honte", "!stathonte", "!massacre+1", "!massacre", "!massacres+1", "!massacres", "!mort", "!morts", "!mort+1", "!morts+1", "!lobby", "!lobby+1", "!lobby-1", "!loby", "!loby+1", "!loby-1", "arretez",
"!canon", "!canon", "!canons", "!canons", "!canon+1", "!canon+1", "!canons+1", "!canons+1",
"!mtop", "!topm", "!topmensuel", "!mensuel", "!top",
"!gtop", "!topg", "!topglobal", "!global",
"!mlvl", "mlevel", "!lvlm", "!lvlmensuel", "!levelm", "!levelmensuel", "!level", "!lvl",
"!glvl", "glevel", "!lvlg", "!lvlglobal", "!levelg", "!levelglobal",
"!mxp", "!xpm", "!xpmensuel", "!xp",
"!gxp", "!xpg", "!xpglobal",
"!élo", "!rank"]

var descriptableCommands = ["!honte", "!stathonte", "!massacre+1", "!mort+1", "!lobby+1", "canons+1", "link+1",
"!top", "!topg", "!lvl", "!lvlg", "!xp", "!xpg",
"!elo"]

 var counterCommands = ["!masacre", "!lobby", "!mort", "!canon"]

 var pasFaite = ["!fc", "!follow",
 "!lastgame?",
 "!viewers???"]

var usedCommands = []

const moderators = ["heliosdesbois", "pouidesbois", "chatdesbois", "solis_the_sun"]

function chat(channel, user, message, isSelf, client, redis){

    if(isSelf){
        return
    }
    let m = message.toLowerCase();
    let username = user.username;

    var args = message.split(" ")
    if(isModerateur(username)){
        if(args[0] == "!police"){
            if(args[2] == undefined) {
                client.say(channel, "Syntaxe invalide.")
                return
            }
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
                                client.say(channel, "Commande "+ command + " créée.")
                            })
                        }else{
                            client.say(channel, "Syntaxe invalide.")
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
                            client.say(channel, "Syntaxe invalide.")
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
                        if(args[3] == null || args[3] == undefined){
                            redis.hget("commands/description", command, (err, reply) => {
                                client.say(channel, reply)
                            })
                            return
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
    
    var testCommand = args[0].toLowerCase()
    redis.hget("commands", testCommand, (err, reply) => {
        if(reply!=null && !usedCommands.includes(testCommand)){
            client.say(channel, reply)
            usedCommands.push(testCommand)
            setTimeout(function() { updateCommands(testCommand) }, 10000);
        }
    })
}

function updateCommands(removedCommand){
    usedCommands.splice(usedCommands.indexOf(removedCommand),1)
}


function isModerateur(username) {
    return moderators.indexOf(username.toLowerCase()) != -1;
}

exports.chat = chat