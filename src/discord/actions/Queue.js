
function Queue(botClient, channel, rolesName) {
  this.botClient = botClient;
  this.channel = channel;
  this.rolesName = rolesName;

  this.commands = {};
  this.moderatorCommands = {};

  this.listeAtt = [];


  /* User commands */
  this.addCommand(["*join queue", "*joinqueue", "*jq"], (message, userRoles) => {
    let user = message.author;

    if (this.listeAtt.indexOf(user) == -1) {
      this.listeAtt.push(user);
      this.channel.send(user + " est ajouté à la liste d'attente");
    } else {
      this.channel.send(user + " est déjà dans la liste d'attente");
    }
  });

  this.addCommand(["*leave queue", "*leavequeue", "*lq"], (message, userRoles) => {
    let user = message.author;

    var index = this.listeAtt.indexOf(user);
    if (index != -1) {
      this.listeAtt.splice(index, 1);
      this.channel.send(user + " est retiré de la liste d'attente");
    } else {
      this.channel.send(user + " n'est pas dans la liste d'attente");
    }
  });

  this.addCommand(["*queue", "*q"] , (message, userRoles) => {
    if (this.listeAtt.length != 0) {
      var msg = "Liste d'attente :\n";
      for (let [index, user] of listeAtt.entries()) {
        msg += (index + 1 + ": " + user.tag + "\n");
      }
      this.channel.send({ embed: { color: 3447003, description: msg } });
    } else {
      message.channel.send("La liste d'attente est vide");
    }
  });

  this.addCommand(["*help", "*?"], (message, userRoles) => {
    message.channel.send({
      embed: {
        color: 3447003,
        description: "Pour rejoindre la liste d'attente : *joinqueue / *jq \n"
          + "Pour la quitter : *leavequeue / *lq \nPour l'afficher : *queue / *q"
      }
    });
  });


  /* Moderator commands */
  this.addModeratorCommand(["*next"], (message, userRoles) => {
    if (this.listeAtt.length == 0) {
      message.channel.send("La liste d'attente est vide !");
      return;
    }
    let nextUser = this.listeAtt.shift();
    message.channel.send(nextUser + ", c'est a ton tour ! Rejoins le channel 'Viewers anti-sel' pour être switch");
    if (this.listeAtt.length == 0) {
      message.channel.send("La liste d'attente est maintenant vide !");
    }
  });

  this.addModeratorCommand(["*clear"], (message, userRoles) => {
    this.listeAtt = [];
    message.channel.send("La liste d'attente a été vidée");
  });

  this.addModeratorCommand(["*add"], (message, userRoles) => {
    let args = message.content.slice(4).toLowerCase().split(" ");
    let insertIndex = parseInt(args.length > 0 && args[0]);

    if (Number.isNaN(insertIndex)) {
      let insertIndex = this.listeAtt.length;

    } else if (insertIndex <= 1) {
      insertIndex = 1;

    } else if (insertIndex - 1 > this.listeAtt.length) {
      insertIndex = this.listeAtt.length;
    }

    let mentions = Array.from(message.mentions.users.values());
    if (mentions.length == 0) return;
    let firstMention = mentions[0];


    this.listeAtt.splice(insertIndex - 1, 0, firstMention);
    message.channel.send(firstMention + " est ajouté à la liste d'attente en position : " + insertIndex);
  });

  this.addModeratorCommand(["*remove"], (message, userRoles) => {
    let args = message.content.slice(7).toLowerCase().split(" ");
    let removeIndex = parseInt(args.length > 0 && args[0]);

    if (Number.isNaN(insertIndex)) {
      let removeIndex = 0;

    } else if (insertIndex <= 0 || insertIndex > this.listeAtt.length) {
      message.channel.send("Personne n'est à cete position");
      return;
    }

    let removedUsers = this.listeAtt.splice(removeIndex - 1, 1);
    let removedUser = removedUsers[0];
    message.channel.send(removedUser.username + " est retiré de la liste d'attente");
  });
}

Queue.prototype.isConcernedByMessage = function(message) {
  let userRoles = this.getRoles(message.member, message.guild, this.rolesName);
  let correctRole = userRoles.administrator || userRoles.moderator;

  let correctChannel = message.channel.name.indexOf(this.channel) != -1

  return correctChannel || correctRole;
};

Queue.prototype.addCommand = function(commands, callback) {
  for (let command of commands) {
    this.commands[command] = this.commands[command] || [];

    this.commands[command].push(callback.bind(this));
  }
};

Queue.prototype.addModeratorCommand = function(commands, callback) {
  for (let command of commands) {
    this.moderatorCommands[command] = this.moderatorCommands[command] || [];

    this.moderatorCommands[command].push(callback.bind(this));
  }
};

Queue.prototype.onMessage = function(message) {
  let actionTriggered = false;

  let userRoles = this.getRoles(message.member, message.guild, this.rolesName);
  let messageContent = message.content.toLowerCase();

  for (let cmdName in this.commands) {
    if (messageContent.startsWith(cmdName)) {
      this.commands[cmdName](message, userRoles);

      actionTriggered = true;
    }
  }

  if (userRoles.administrator || userRoles.moderator) {
    for (let cmdName in this.moderatorCommands) {
      if (messageContent.startsWith(cmdName)) {
        this.moderatorCommands[cmdName](message, userRoles);

        actionTriggered = true;
      }
    }
  }

  return actionTriggered;
};


// Duplicate from BotReactions.js
Queue.prototype.getRoles = function(member, guild, roles) {
  var posessedRoles = {};

  for (let roleTitle in roles) {
    let roleName = roles[roleTitle];
    let guildRole = guild.roles.find(r => r.name == roleName);

    let hasRole = false;

    if (guildRole !== null) {
      let roleId = guildRole.id;
      hasRole = member.roles.has(roleId);
    }

    posessedRoles[roleTitle] = hasRole;
  }

  return posessedRoles;
};


module.exports = Queue;
