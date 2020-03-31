var redis, Discord
var qlistboo
const modsID = ["243477125653463040", "323201750964109312", "88651294448848896"]//, "156139455508512768", "313638442326163458", "600475482659487764"]
                //Helios                Poulpita                Poulpito            Gunter                  Izan                Coco

/*
 * Return false if the message is ignored by this module
 * Returns true if the message will probably be used
 */
Poulpita.prototype.isConcernedByMessage = function(message) {
    if (message.author.bot) return false;
  
    return true;
};

function Poulpita(
    botClient,
    rolesName,
    redisClient,
    disc
    ) {
    this.botClient = botClient;
    this.rolesName = rolesName;

    redis = redisClient;
    Discord = disc;

this.botClient.on('message', message => {
    
    if(message.channel.type == "dm"){
        
        let m = message.content.toLowerCase()
        let username = message.author.username;
        
        var args = message.content.split("/")
        var args = message.content.split(" ")
        isModUp =  isModerateur(message.author.id)
        if(isModUp){
            if(args[0] == "!question"){
                if(args.length == 1){
                    //donner une question random
                    redis.hgetall("poulpita/questions", (err, questions) => {
                        nq = randInt(Object.keys(questions).length)
                        message.channel.send(Object.keys(questions)[nq])
                    })
                }else if(args.length == 2 && args[1]!="list"){
                    //donner cette question
                    nq = parseInt(args[1]) || 0;
                    if(nq>0){
                        redis.hgetall("poulpita/questions", (err, questions) => {
                            if(nq<=Object.keys(questions).length){
                                message.channel.send(Object.keys(questions)[nq-1])
                            }
                        })
                    }
                }else{
                    var args0 = Array.from(args);
                    var questRep = args0.splice(2).join(" ").split("/")
                    var question = questRep[0]
                    var reponse = questRep[1]
                    
                    switch (args[1]){
                        case "add":
                        redis.hexists("poulpita/questions", question, (err, exists) => {
                            if(exists){
                                message.channel.send("Cette question existe déjà.")
                            }else{
                                redis.hset("poulpita/questions", question, reponse, (err, reply) => {
                                    message.channel.send("Question créée.")
                                })
                            }
                        })
                        break
                       case "edit":
                       getQuestion(args[2]).then( nq => {
                           redis.hexists("poulpita/questions", question, (err, exists) => {
                               if(!exists && nq<1){
                                   message.channel.send("Cette question n'existe pas.")
                               }else{
                                   redis.hgetall("poulpita/questions", (err, questions) => {
                                       if(nq>0){
                                            question = Object.keys(questions)[nq-1]
                                        }
                                       redis.hset("poulpita/questions", question, reponse, (err, reply) => {
                                           message.channel.send("Reponse modifiée.")
                                       })
                                   })
                               }
                           })
                       })
                       break
                        case "remove":
                        getQuestion(args[2]).then( nq => {
                            redis.hexists("poulpita/questions", question, (err, exists) => {
                                if(!exists && nq<1){
                                    message.channel.send("Cette question n'existe pas.")
                                }else{
                                    redis.hgetall("poulpita/questions", (err, questions) => {
                                        if(nq>0){
                                            question = Object.keys(questions)[nq-1]
                                        }
                                        redis.hdel("poulpita/questions", question, (err, reply) => {
                                            message.channel.send("Question supprimée.")
                                        })
                                    })
                                }
                            })
                        })
                        break
                        case "list":
                        redis.hgetall("poulpita/questions", (err, questions) => {
                            var qlist = ""
                            var nq = 1
                            qlistboo = true
                            for (var q in questions) {
                                qlist2 = qlist + nq +  ". " + q + "/" + questions[q] + "\n"

                                if(qlist2.length>2048){
                                    afficheList(qlist, message)
                                    qlist2 =  nq +  ". " + q + "/" + questions[q] + "\n"
                                }
                                nq++
                                qlist=qlist2
                            }
                            afficheList(qlist, message)
                        })
                        break
                    }
                }

            }
        }
        
    }
})
}

function afficheList(qlist, message){
    if(qlistboo){
        qlistboo = false
        const embed = new Discord.RichEmbed()
        .setColor('#0099ff')
        .setTitle('Questions')
        .setDescription(qlist)
        message.channel.send(embed);
    }else{
        const embed = new Discord.RichEmbed()
        .setColor('#0099ff')
        .setDescription(qlist)
        message.channel.send(embed);
    }

}

function getQuestion(number){
    return new Promise(function(resolve, reject){
        nq = parseInt(number) || -1;
        if(nq < 1){
            resolve( -1 )
        }
        redis.hgetall("poulpita/questions", (err, questions) => {
            if(Object.keys(questions).length < nq){
                resolve( 0 )            }
            resolve( nq )
        })
    })

}

function randInt(length){
    return Math.floor(Math.random()*length)
}
        
// Duplicate from BotReactions.js
Poulpita.prototype.getRoles = function(member, guild, roles) {
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

function isModerateur(id) {
    return modsID.indexOf(id) != -1;
}

module.exports = Poulpita;
