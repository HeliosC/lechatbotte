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

// var timerRegex = ["!massacre", "!lobb?y", "!mort", "!cann?on"]
// var timerRedis = ["massacres", "lobbies", "mortsLink", "canons"] 

var timers = [
    massacre = {
        regex : "!massacre",
        redis : "massacres",
        // on : true,
        function : afficheMassacres
    },
    lobby = {
        regex : "!lobb?y",
        redis : "lobbies",
        // on : true,
        function : afficheLobbies
    },
    mort = {
        regex : "!mort",
        redis : "mortsLink",
        // on : true,
        function : afficheMortsLink
    },
    cannon = {
        regex : "!cann?on",
        redis : "canons",
        // on : true,
        function : afficheCanons
    }
]

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

var redis

function command_manager(
    botClient,
    rolesName,
    redisClient
    ) {
    this.botClient = botClient;
    this.rolesName = rolesName;

    redis = redisClient;
  }

//client.on('chat', (channel, user, message, isSelf) => {

/*
 * Return false if the message is ignored by this module
 * Returns true if the message will probably be used
 */
command_manager.prototype.isConcernedByMessage = function(message) {
    if (message.author.bot) return false;
  
    return true;
};

command_manager.prototype.onMessage = function(
    // channel, user, message, isSelf, client, redis
    message
    ){

    let m = message.content.toLowerCase();
    let username = message.author.username;

    let userRoles = this.getRoles(message.member, message.guild, this.rolesName);

    var args = message.content.split(" ")
    if(userRoles.administrator || userRoles.moderator){
        if(args[0] == "!police"){
            var command = args[2].toLowerCase()
            if(["add", "edit", "remove"].includes(args[1]) && allBotCommands.includes(command)){
                message.channel.send("Cette commande n'est pas modifiable.")
                return
            }
            switch (args[1]){
                case "add":
                    redis.hexists("commands", command, (err, exists) => {
                        if(exists){
                            message.channel.send("Cette commande existe déjà.")
                        }else if(args[3]!=null && args[3]!=undefined){
                            redis.hset("commands", command, args.slice(3).join(" "), (err, reply) => {
                                message.channel.send("Commande "+ command + " créée.")
                            })
                        }
                    })
                    break
                case "edit":
                    redis.hexists("commands", command, (err, exists) => {
                        if(!exists){
                            message.channel.send("Cette commande n'existe pas.")
                        }else if(args[3]!=null && args[3]!=undefined){
                            redis.hset("commands", command, args.slice(3).join(" "), (err, reply) => {
                                message.channel.send("Commande "+ command + " modifiée.")
                            })
                        }else{
                        }
                    })
                    break
                case "remove":
                    redis.hexists("commands", command, (err, exists) => {
                        if(!exists){
                            message.channel.send("Cette commande n'existe pas.")
                        }else{
                            redis.hdel("commands", command, (err, reply) => {
                                message.channel.send("Commande "+ command + " supprimée.")
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
                            message.channel.send("Description de la commande "+ command + " modifiée.")
                        })
                    }else{
                        message.channel.send("Impossible d'ajouter une description à cette commande.")
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
            message.channel.send(reply)
            usedCommands.push(testCommand)
            //console.log("avant slice "+testCommand+ " / "+usedCommands)
            setTimeout(function() { updateCommands(testCommand) }, 10000);
        }
    })

    // for (const [index, timer] of timerRedis.entries()) {
    for (let timer of timers) {
        
        let strmod = timer.regex.replace('?', '')
        var rp1 = new RegExp("^"+timer.regex+"s?\\s?\\+\\s?1$", 'gmi');
        var r = new RegExp("^"+timer.regex+"s?$", 'gmi');
        var rm1 = new RegExp("^"+timer.regex+"s?\\s?-\\s?1$", 'gmi');
        var rmod = new RegExp("^"+strmod+"s? \\d$", 'gmi');

        if ( (userRoles.administrator || userRoles.moderator) && rp1.test(m)) { //*massacre -> incremente
            
            // timer.on = false
            // setTimeout(function () {
            //     timer.on = true
            // }, 15000); 
            
            redis.incr(timer.redis, function (err, reply) {
                timer.function(message.channel, parseInt(reply));
            });
    
        } else if (r.test(m)) { //*massacres -> affiche le nb
            redis.get(timer.redis, function (err, reply) {
                timer.function(message.channel, parseInt(reply));
            });
    
        } else if ( (userRoles.administrator || userRoles.moderator) && rm1.test(m)) {
            redis.decr(timer.redis, function (err, reply) {
                timer.function(message.channel, parseInt(reply));
            });
        }
        else if ( (userRoles.administrator || userRoles.moderator) && rmod.test(m)) {
            massacres = parseInt(m.slice(strmod.length + 1)) || 0;
            timer.function(message.channel, massacres);
            redis.set(timer.redis, massacres);
        }
    
    }


    //}
//})
}

// Duplicate from BotReactions.js
command_manager.prototype.getRoles = function(member, guild, roles) {
    var posessedRoles = {};
  
    for (let roleTitle in roles) {
      let roleName = roles[roleTitle];
      let guildRole = guild.roles.find(r => r.name == roleName);
  
      let hasRole = false;
  
      if (guildRole !== null) {
        let roleId = guildRole.id;
        if(member!==null){
          hasRole = member.roles.has(roleId);
        }
      }
  
      posessedRoles[roleTitle] = hasRole;
    }
  
    return posessedRoles;
  };

function updateCommands(removedCommand){
    //console.log("slice "+removedCommand + " / "+usedCommands + " / " + usedCommands.indexOf(removedCommand))
    usedCommands.splice(usedCommands.indexOf(removedCommand),1)
    //console.log("apres slice "+removedCommand + " / "+usedCommands)
}



function afficheMassacres(channel, massacres) {
    channel.send(
        `Chatdesbois a massacré ${massacres} pseudo${massacres > 1 ? "s" : ""} en toute impunité ! 👌🏻 (depuis mars 2019)`
    );

}

function afficheLobbies(channel, lobbies) {
    channel.send(
        `Chatdesbois est retournée ${lobbies} fois au lobby, qui peut la stopper ?`
    );

}

function afficheMorts(channel, morts) {
    channel.send(
        `Lara Croft est morte ${morts} fois`
    );

}

function afficheMortsLink(channel, morts) {
    channel.send(
        `Link est mort ${morts} fois depuis le début !`
    );

}

function afficheCanons(channel, canons) {
    channel.send(
        `${canons} canons ont été ratés ! 👌🏻 (depuis novembre 2019)`
    );

}





module.exports = command_manager;
