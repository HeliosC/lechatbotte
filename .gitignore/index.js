const Discord = require("discord.js");
const client = new Discord.Client();

const chanIm = "images_videos_trop_lentes";
//const chanIm2 = "images";


// Extract the required classes from the discord.js module
const { Client, MessageAttachment } = require('discord.js');


client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});



client.on('message', msg => {
	
  if(msg.content.indexOf("kalista")!=-1){
    msg.reply("kali quoi ?")
  }
	


  if(!msg.author.bot){
	  
    for (user of client.users){
      if( user[1].username == "Le Chat Botté" && user[1].bot){
        if(msg.isMemberMentioned(user[1])){
          msg.reply("reste tranquile")
        }
      }
    }  

    let modRole = msg.guild.roles.find("name", "🐾Chats sous chef");
    let adminRole = msg.guild.roles.find("name", "🦄Le Chat en chef");



    if(msg.channel.name != chanIm && !(msg.member.roles.has(modRole.id) || msg.member.roles.has(adminRole.id) ) ){
        for( var [key, value] of msg.attachments ){
  
            client.channels.find('name',chanIm).send(""+msg.author+" : "+msg.content)
            client.channels.find('name',chanIm).send( { file : value.proxyURL } )
            msg.channel.send(""+msg.author+" "+client.channels.find("name",chanIm))
		

		

      setTimeout(suiteTraitement, 500) 
      function suiteTraitement()
          {
            msg.delete()
          }

            break

        }

    }}


})

client.login(process.env.TOKENchat);
