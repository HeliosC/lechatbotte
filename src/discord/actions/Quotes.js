var qlistboo = false

function Quotes(botClient, channels, rolesName, redisClient, DiscordClient) {
    this.botClient = botClient;
    // this.channel = channels.channelCh;
    this.channelTest = channels.test;
    this.rolesName = rolesName;
    this.redis = redisClient
    this.discord = DiscordClient

    this.validatingMessage = null;
    this.quoteZerator = null
    this.quoteZeratorState = null;
}

Quotes.prototype.isModerator = function(message) {
    let userRoles = this.getRoles(message.member, message.guild, this.rolesName);
    return userRoles.administrator || userRoles.moderator;
};

Quotes.prototype.isConcernedByMessage = function(message) {
    return message.channel.name.indexOf(this.channelTest) != -1 && !message.author.bot;
};

Quotes.prototype.onMessage = function(message) {
    let actionTriggered = false;

    if (message.content.toLowerCase().startsWith("!acceptquotes") ) {
        this.redis.lrange("quotes-temp", 0, -1, (err, quotes) => {
            this.quoteZerator = quotes.values();
            this.quoteZeratorState = this.quoteZerator.next()
            
            message.channel.send(this.generateEmbed(this.quoteZeratorState.value))
            .then(message => {
                this.validatingMessage = message

                var yesEmoji = this.botClient.emojis.find(e => e.name == "yea");
                var noEmoji = this.botClient.emojis.find(e => e.name == "nay");

                message.react(yesEmoji)
                    .then(() => {
                        message.react(noEmoji);
                    })

            }).catch(console.error);
        })
    }

    if (message.content.toLowerCase().startsWith("!quotes") ) {
        this.redis.lrange("quotes", 0, -1, (err, quotes) => {
            var quotesStr = ""
            var qlist = ""
            var qlist2 = ""
            qlistboo = true
            for (const [index, quote] of quotes.entries()) {
                qlist2 = qlist + index + " - " + quote + "\n"

                if(qlist2.length>2048){
                    this.afficheList(qlist, message)
                    qlist2 = index + " - " + quote + "\n"
                }
                qlist=qlist2
            }
            this.afficheList(qlist, message)
        })
    }
    return actionTriggered;
};

Quotes.prototype.isConcernedByReaction = function(reaction) {
    return reaction.message.channel.name.indexOf(this.channelTest) != -1;
};

Quotes.prototype.onReaction = function(reaction, user) {
    let actionTriggered = false;

    if (user.bot) { return actionTriggered }

    if (reaction.message.id = this.validatingMessage.id && !this.quoteZeratorState.value) {
        if (reaction.emoji.name == "yea") {
            this.redis.lpush("quotes", this.quoteZeratorState.value);
            this.nextQuote(reaction, user)
            actionTriggered = true;
        } else if (reaction.emoji.name == "nay") {
            this.nextQuote(reaction, user)
            actionTriggered = true;
        }
    }
    return actionTriggered;
};

Quotes.prototype.nextQuote = function(reaction, user) { 
    reaction.remove(user);
    this.redis.lrem("quotes-temp", 1, this.quoteZeratorState.value);
    this.quoteZeratorState = this.quoteZerator.next();
    if(!this.quoteZeratorState.done) {
        this.validatingMessage.edit(this.generateEmbed(this.quoteZeratorState.value))
    } else {
        this.validatingMessage.delete()
    }
};

Quotes.prototype.generateEmbed = function(description) { 
    const embed = new this.discord.RichEmbed()
    .setColor('#0099ff')
    .setTitle('Accepter cette quote ?')
    .setDescription(description)
    return embed
};

// Duplicate from BotReactions.js
Quotes.prototype.getRoles = function(member, guild, roles) {
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

Quotes.prototype.afficheList = function(qlist, message) {
    if(qlistboo){
        qlistboo = false
        const embed = new this.discord.RichEmbed()
        .setColor('#0099ff')
        .setTitle('Quotes')
        .setDescription(qlist)
        message.channel.send(embed);
    }else{
        const embed = new this.discord.RichEmbed()
        .setColor('#0099ff')
        .setDescription(qlist)
        message.channel.send(embed);
    }
}

module.exports = Quotes;
