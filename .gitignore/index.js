/*const Discord = require("discord.js");
const client = new Discord.Client();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
  if (msg.content === "pong") {
    msg.reply("Ping!");
	msg.channel.send("YO MON POTE");
  }
});

client.login(process.env.TOKENchat);
*/


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
	
  /*if (msg.content === "ping") {
    msg.reply("Ping!")
	msg.channel.send("YOo")
  }*/

  //msg.channel.send( msg.channel.name)



  /*if(msg.attachments === null){
    console.log("ah") 
  }else{
    console.log("ok") 
    //msg.channel.send( msg.attachments.map )  
    for( var [key, value] of msg.attachments ){
      //console.log(key + ' = ' + value)
      msg.reply("reste tranquille")
      //break
    }
    //client.channels.find('name','images').send(msg)

  }*/

  if(!msg.author.bot){
    if(msg.channel.name != chanIm){
	//client.channels.find('name',chanIm).send("URL : "+msg.attachments.proxyURL)
        for( var [key, value] of msg.attachments ){
            //client.channels.find('name',chanIm).send("0")
            //client.channels.find('name',chanIm).send(""+msg.author+" : "+msg.content,{  file : msg.MessageAttachment })
            //client.channels.find('name',chanIm).send("1")
		

		
            //client.channels.find('name',chanIm).send(""+msg.author+" : "+msg.content,{ file : value.proxyURL })
            //client.channels.find('name',chanIm).send(""+msg.author+" : "+msg.content,{ file : value.url })
		
	    //client.channels.find('name',chanIm).send("wesh")
            client.channels.find('name',chanIm).send(""+msg.author+" : "+msg.content)
            client.channels.find('name',chanIm).send( { file : value.url } )
            client.channels.find('name',chanIm).send( { file : value.proxyURL } )
            msg.channel.send(""+msg.author+" "+client.channels.find("name",chanIm))
		

		
	/*
	    client.channels.find('name',chanIm2).send("wesh")
            client.channels.find('name',chanIm2).send(""+msg.author+" : "+msg.content)
            client.channels.find('name',chanIm2).send( { file : value.url } )
            client.channels.find('name',chanIm2).send( { file : value.proxyURL } )
            msg.channel.send(""+msg.author+" "+client.channels.find("name",chanIm2))
*/

            //client.channels.find('name',chanIm).send("2")
            //client.channels.find(val => val.name === chanIm).send(""+msg.author+" : "+msg.content,{ file : value.proxyURL })
	
		
            //msg.channel.send(value.message)
            //client.channels.find('name','images').send("lolilol")
            //client.channels.find('name','images').send(msg.content,{   file: "https://www.sciencesetavenir.fr/assets/img/2017/03/29/cover-r4x3w1000-58dbbd655242b-capture-d-e-cran-2017-03-29-a-15-55-40.png"    })
            //const attachment = new MessageAttachment('https://i.imgur.com/w3duR07.png');
            //const attachment = new MessageAttachment(value.);
            //msg.channel.send(`${msg.author},`, attachment)

	    //break

	msg.delete()

        }

    }}


  /*if(!msg.author.bot){
    console.log(msg.embeds.length)
  }*/


})

client.login(process.env.TOKENchat);
