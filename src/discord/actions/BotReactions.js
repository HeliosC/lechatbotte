const reactionsDB = require("./bddreactions/BDDreactions");


function BotReactions(
  botClient,
  channels,
  rolesName,
  commandPrefix) {

  this.botClient = botClient;
  this.channels = channels;
  this.rolesName = rolesName;
  this.commandPrefix = commandPrefix;
}

/*
 * Return false if the message is ignored by this module
 * Returns true if the message will probably be used
 */
BotReactions.prototype.isConcernedByMessage = function(message) {
  if (message.author.bot) return false;

  return true;
};

/*
 * Returns true if the message has been used (It serves to detect conflicts between modules)
 * Returns false if the message did not trigger any actions
 */
BotReactions.prototype.onMessage = function(message) {
  let actionTriggered = false;

  let memberRoles = this.getRoles(message.member, message.guild, this.rolesName);

  actionTriggered |= this.reactToMessage(message, memberRoles);
  actionTriggered |= this.reactToMention(message, memberRoles);

  if (!(memberRoles.administrator || memberRoles.moderator)) {
    actionTriggered |= this.checkImageToMove(message);
  } else {
    if (message.author.username == "Helios ⭐⭐") { // TODO: move the hardcoded values to a better place
      this.parleBot(message);
    }
  }

  return actionTriggered;
};

BotReactions.prototype.getRoles = function(member, guild, roles) {
  var posessedRoles = {};

  for (let roleTitle in roles) {
    let roleName = roles[roleTitle];
    let guildRole = guild.roles.find(r => r.name == roleName);

    let hasRole = false;

    if (guildRole !== null) {
      let roleId = guildRole.id;
      if( member !== null ){
        hasRole = member.roles.has(roleId);
      }
    }

    posessedRoles[roleTitle] = hasRole;
  }

  return posessedRoles;
};

BotReactions.prototype.reactToMessage = function(message, memberRoles) {
  var triggeredAction = false;
  for (reaction of reactionsDB.messagesReactions) {
    // Check if the reaction sould be testes
    if (reaction.disabled) continue;

    if (isType(Function, reaction.exception, `exception should be a Function in ${JSON.stringify(reaction)}`)
        && reaction.exception(this.botClient, message, memberRoles)) {
      continue;
    }

    let messageContent = message.content.toLowerCase();

    let willBeUsed = false;

    // Check if the reaction sould be used
    if (isType(Array, reaction.startsWith, `startsWith should be an Array in ${JSON.stringify(reaction)}`)) {
      for (let value of reaction.startsWith) {
        if (messageContent.startsWith(value)) {
          willBeUsed = true;
          break;
        }
      }
    }

    if (!willBeUsed && isType(Array, reaction.contains, `contains should be an Array in ${JSON.stringify(reaction)}`)) {
      for (let value of reaction.contains) {
        if (messageContent.indexOf(value) >= 0) {
          willBeUsed = true;
          break;
        }
      }
    }

    if (!willBeUsed) continue;

    let hasBeenUsed = false;

    // We execute the defined actions
    let getFromValueOrFunction = (value, onExistingValue) => {
      let response = value;
      if (isType(Function, value)) {
        response = value(this.botClient, message, memberRoles);
      }

      if (response) {
        onExistingValue(response);
        hasBeenUsed = true;
      }
    };


    getFromValueOrFunction(reaction.responseChannel, response => {
      message.channel.send(response);

      console.debug(`send response to channel: ${response}`);
    });

    getFromValueOrFunction(reaction.responseReply, response => {
      message.reply(response);

      console.debug(`reply with: ${response}`);
    });

    getFromValueOrFunction(reaction.responseReact, emoji => {
      message.react(emoji);

      console.debug(`react with: ${emoji}`);
    });


    if (!hasBeenUsed) {
      console.warn(`reaction should have been used, but nothing happend (${JSON.stringify(reaction)})`);
    } else {
      triggeredAction = true;
    }
  }

  return triggeredAction;
};

BotReactions.prototype.reactToMention = function(message, memberRoles) {
  var triggeredAction = false;

  if (message.mentions.everyone) return triggeredAction;
  if (!message.isMemberMentioned(this.botClient.user)) return triggeredAction;


  if (memberRoles.administrator) {
    message.react(this.botClient.emojis.find(e => e.name == "LapinDab"))

  } else if (memberRoles.moderator) {
    if (message.author.username == "Poui des bois") {
      message.react("🗡");

    } else if (message.author.username == "Solis Le Soleil") {
      message.react(this.botClient.emojis.find(e => e.name == "lovedesbois"));

    } else if (message.author.username == "Helios ⭐⭐") {
      message.react(this.botClient.emojis.find(e => e.name == "lovedesbois"));

    } else {
      message.react("❤");
    }
  } else if (memberRoles.subscriber) {
    message.react("💕");
  } else if (memberRoles.donnator) {
    message.react("🐱");
  } else {
    message.reply("reste tranquille");
  }

  triggeredAction = true;
  return triggeredAction;
};

BotReactions.prototype.checkImageToMove = function(message) {
  var triggeredAction = false;

  if (message.channel.name != this.channels.chanCh) return triggeredAction;

  if (/(http(s?):)([/|.|\w|\s|-])*\(.|-)(?:jpg|jpeg|gif|png)/.test(message.content)
  ||/https?:\/\/tenor\.com\/view\/.+/.test(message.content)
  ||/https?:\/\/giphy\.com\/gifs\/.+/.test(message.content)
  ||/https?:\/\/gfycat\.com\/.+/.test(message.content)
  ||/https?:\/\/youtube\..{2,3}\/.+/.test(message.content)
  ){
    message.channel.send(message.author + " : " + this.botClient.channels.find(c => c.name == this.channels.images));
    let imageChannel = this.botClient.channels.find(c => c.name == this.channels.images);
    imageChannel.send(this.botClient.channels.find(c => c.name == this.channels.chanCh) + "\n" + message.author + " : " + message.content);
    for (let [key, value] of message.attachments) {
      imageChannel.send({ file: value.proxyURL })
      triggeredAction = true;
      break;
    }
      setTimeout(() => { message.delete() }, 1000);
  }else{

  for (let [key, value] of message.attachments) {
    let imageChannel = this.botClient.channels.find(c => c.name == this.channels.images);
    imageChannel.send(this.botClient.channels.find(c => c.name == this.channels.chanCh) + "\n" + message.author + " : " + message.content);
    imageChannel.send({ file: value.proxyURL })

    message.channel.send(message.author + " : " + this.botClient.channels.find(c => c.name == this.channels.images));

    setTimeout(() => { message.delete() }, 500);

    triggeredAction = true;
    break;
  }
}

  return triggeredAction;
};

BotReactions.prototype.parleBot = function(message) {
  if (!message.content.startsWith(this.commandPrefix)) {
    return;
  }

  message.channel.send(message.content.replace(this.commandPrefix, ""));
  var hasAttachment = false;
  for (var [key, value] of message.attachments) {
    message.channel.send({ file: value.proxyURL });
    hasAttachment = true;
    break;
  }
  if (hasAttachment) {
    setTimeout(() => { message.delete() }, 500);
  } else {
    message.delete();
  }
}



/*
 * Returns true if `value` is an insnance of `type`
 * If an error message is provided, it will be printed
 *   if `value` does not have the correct type and is different than null or undefined
 */
function isType(type, value, errorMessage) {
  // Test without log warning
  if (errorMessage === undefined) {
    return value instanceof type;
  }

  // Test with warning
  if (value === null || value === undefined) {
    return false;
  }

  if (value instanceof type) {
    return true;
  } else {
    console.warn(`[WARNING]: ${errorMessage}`)
  }

  return false;
}

module.exports = BotReactions;
