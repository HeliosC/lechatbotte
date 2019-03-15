const lechatbotte = require('./src/discord/lechatbotte');
const twitchBotHeliosDesBois = require('./src/twitch/heliosDesBois/bot.js');
const twitchBotPoliceDesBois = require('./src/twitch/policeDesBois/bot.js');
const twitchBotPouiDesBois = require('./src/twitch/pouiDesBois/bot.js');

lechatbotte.start()


twitchBotHeliosDesBois.start()
twitchBotPoliceDesBois.start()
twitchBotPouiDesBois.start()

var client = require('redis').createClient(process.env.REDIS_URL);
client.on('connect', function() {
    console.log('connected');
});


client.set('key', 'value');

client.get('key', function(err, reply) {
    console.log(reply); // "value"
});