const Param = require('./Packages/Param.js');
const Discord = require("discord.js")
const client = new Discord.Client()

client.on('ready', () => { console.log(`Logged in as ${client.user.tag}!`) })
client.on("error", (e) => console.error(e));
client.on("warn", (e) => console.warn(e));
client.on("debug", (e) => console.info(e));

Param.setParam(client)


var t = "0123456"
client.on('message', msg => {
    //console.log( msg.content.toLowerCase().substr(4) )
    //Param.message(msg)

    if( msg.content == "***bite***" && msg.author.username == "Helios" && msg.channel.name == "testbotquiz"){
        msg.reply("ca va")
        test()
    }
})

client.on('messageReactionAdd', (reaction, user) => {
    //Param.messageReactionAdd(reaction, user)
})


//setTimeout(test,60*5*1000)

var I = 0
function test(){
    setTimeout(() => {
        //console.log("a")
        I=I+1
        client.channels.find('name', "testbotquiz").send("test "+I)
        test()
    }, 30*1000);
}

client.login(process.env.TOKENchat)
