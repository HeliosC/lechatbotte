var redis = require('redis').createClient(process.env.REDIS_URL);
redis.on('connect', function () {
    console.log('redis connected');
});


const lechatbotte = require('./src/discord/lechatbotte');
require('./src/web/app.js');
// require('./api twitch.js')
// const twitchBotHeliosDesBois = require('./src/twitch/heliosDesBois/bot.js');
const twitchBotPoliceDesBois = require('./src/twitch/policeDesBois/bot.js');
// const twitchBotPouiDesBois = require('./src/twitch/pouiDesBois/bot.js');
const twitchBotPoliceNationaleDuSwag = require('./src/twitch/policeNationaleDuSwag/bot.js');
// const twitchBotSolisTheSun = require('./src/twitch/solisTheSun/bot.js');

lechatbotte.start(redis)

// twitchBotHeliosDesBois.start()
twitchBotPoliceDesBois.start(redis)
// twitchBotPouiDesBois.start()
twitchBotPoliceNationaleDuSwag.start()
// twitchBotSolisTheSun.start()
