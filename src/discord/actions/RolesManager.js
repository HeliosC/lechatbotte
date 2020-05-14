const BDDRoles = require("./bddroles/BDDroles");


function RolesManager(botClient, roleChannel) {
    this.botClient = botClient;
    this.roleChannel = roleChannel;
}

RolesManager.prototype.isConcernedByMessage = function(message) {
    return message.channel.name.indexOf(this.roleChannel) != -1;
};

// RolesManager.prototype.onMessage = function(message) {
//     this.botClient.users
//         .find(u => u.username == BDDRoles.advertisedUser)
//         .send(message.author.tag + " : " + message.content);

//     let roles = this.extractRoles(message);

//     for (let role of roles) {
//         this.modifRole(message, role);
//     }

//     message.delete();

//     return true;
// };

RolesManager.prototype.onReaction = function(reaction, user) {
    let role = reaction.message.guild.roles.find(r => r.name.includes(reaction.emoji.name));
    let member = reaction.message.guild.member(user);
    if(role == null || role.name.toLowerCase().includes("chat")){
        reaction.remove(user);
        return true;
    };
    if (!member.roles.has(role.id)) {
        member.addRole(role.id);
        // user.send("Tu as maintenant le role : " + role.name);
    }
    return true;
};

RolesManager.prototype.onReactionRemove = function(reaction, user) {
    let role = reaction.message.guild.roles.find(r => r.name.includes(reaction.emoji.name));
    let member = reaction.message.guild.member(user);
    if (role != null && !role.name.toLowerCase().includes("chat") && member.roles.has(role.id)) {
        member.removeRole(role.id);
        // user.send("Tu n'as plus le role : " + role.name);
    }
    return true;
};

// RolesManager.prototype.extractRoles = function(message) {
//     let messageContent = message.content.toLowerCase();

//     let roles = [];

//     for (let {roleName, roleTitle} of BDDRoles.roles) {
//         for(let roleStr of roleName){
//             if (messageContent.indexOf(roleStr) != -1) {
//                     let role = message.guild.roles.find(r => r.name == roleTitle);
//                 roles.push(role);
//             }
//         }
//     }

//     return roles;
// };

// RolesManager.prototype.modifRole = function(message, role) {
//     if(role === null){return;}
//     if (message.member == null || !message.member.roles.has(role.id)) {
//         message.member.addRole(role.id);
//         message.author.send("Tu as maintenant le role : " + role.name);
//         this.botClient.users
//             .find(u => u.username == BDDRoles.advertisedUser)
//             .send(message.author.tag + " a maintenant le role : " + role.name);
//     } else {
//         message.member.removeRole(role.id);
//         message.author.send("Tu n'as plus le role : " + role.name);
//         this.botClient.users
//             .find(u => u.username == BDDRoles.advertisedUser)
//             .send(message.author.tag + " n'a plus le role : " + role.name);
//     }
// };

module.exports = RolesManager;
