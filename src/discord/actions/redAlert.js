const guildID = "216522270682775552"
const modoID = "266987117920387073"
const alerteCatID = "731833813990375444"
const toNotOverwrite = ["299124426866294787", "273531883520917505", "701768485151309876", alerteCatID, "731837730987835444", "731839104219742208"]
const permissionsFormats = {
    "true": true,
    "false": false,
    "null": null
}

function redAlert(
    botClient, 
    rolesName,
    redisClient
    ) {
    this.botClient = botClient;
    this.rolesName = rolesName;
    this.redis = redisClient
}
  
redAlert.prototype.isConcernedByMessage = function(message) {
    let userRoles = this.getRoles(message.member, message.guild, this.rolesName);
    if(userRoles.administrator || userRoles.moderator) return true;
    return false;
};

redAlert.prototype.onMessage = function(message) {
    let m = message.content.toLowerCase();
    if(m == "!bunker") this.bunker()
    else if(m == "!unbunker") this.unbunker()
    else return false

    return true
};

redAlert.prototype.bunker = function(){
    this.overwriteViewChannel(alerteCatID, guildID, true);
    const channels = this.botClient.guilds.get(guildID).channels;
    for(let channel of channels){
        if(channel[1].permissionOverwrites.size == 0){
            this.redis.hset("discord/" + guildID + "/channels/" + channel[0] + "/" + guildID, "VIEW_CHANNEL", "null")
                this.overwriteViewChannel(channel[0], guildID, false);
            continue;
        } 
        channel[1].permissionOverwrites.forEach(role => {
            if((role.allow & 1024) != 0) permission = true;
            else if((role.deny & 1024) != 0) permission = false;
            else permission = "null";
            this.redis.hset("discord/" + guildID + "/channels/" + channel[0] + "/" + role.id, "VIEW_CHANNEL", permission)
            if(role.id != modoID && !toNotOverwrite.includes(channel[0])){
                this.overwriteViewChannel(channel[0], role.id, false);
            }
        });
    }
}

redAlert.prototype.unbunker = function(){
    const channels = this.botClient.guilds.get(guildID).channels;
    for(let channel of channels){
        if(channel[1].permissionOverwrites.size == 0){
            this.overwriteViewChannel(channel[0], guildID, null);
            continue;
        } 
        channel[1].permissionOverwrites.forEach(role => {
            this.redis.hget("discord/" + guildID + "/channels/" + channel[0] + "/" + role.id, "VIEW_CHANNEL", (err, permission) => {
                permission = permissionsFormats[permission];  
                this.overwriteViewChannel(channel[0], role.id, permission);
            })
        });
    }
}

redAlert.prototype.overwriteViewChannel = function(channelID, roleID, permission){
    const clientArbreAChat = this.botClient.guilds.get(guildID);
    clientArbreAChat.channels.get(channelID).overwritePermissions(
        clientArbreAChat.roles.get(roleID) || clientArbreAChat.members.get(roleID),
        { VIEW_CHANNEL: permission }
    );
}

// Duplicate from BotReactions.js
redAlert.prototype.getRoles = function(member, guild, roles) {
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

module.exports = redAlert