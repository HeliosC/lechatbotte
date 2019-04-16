const lechatbotte = require('./src/discord/lechatbotte');
const twitchBotHeliosDesBois = require('./src/twitch/heliosDesBois/bot.js');
const twitchBotPoliceDesBois = require('./src/twitch/policeDesBois/bot.js');
const twitchBotPouiDesBois = require('./src/twitch/pouiDesBois/bot.js');
const twitchBotPoliceNationaleDuSwag = require('./src/twitch/policeNationaleDuSwag/bot.js');
const twitchBotSolisTheSun = require('./src/twitch/solisTheSun/bot.js');

lechatbotte.start()

twitchBotHeliosDesBois.start()
twitchBotPoliceDesBois.start()
twitchBotPouiDesBois.start()
twitchBotPoliceNationaleDuSwag.start()
twitchBotSolisTheSun.start()

var fs = require('fs');
 
var contents = fs.readFileSync('./salut.txt', 'utf8');
console.log(contents)

var content = "hello world!";

try{
    fs.writeFileSync('./salut.txt', content);
    console.log("c'est déjà ça")
}catch (e){
    console.log("Cannot write file ", e);
}

fs.appendFile('./ccatoustxt', 'Hello content!', function (err) {
  if (err) throw err;
  console.log('Saved!');
});
