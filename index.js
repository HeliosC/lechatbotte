var redis = require('redis').createClient(process.env.REDIS_URL);
redis.on('connect', function () {
    console.log('redis connected');
});

// require('./src/web/app.js');

const lechatbotte = require('./src/discord/lechatbotte');
lechatbotte.start(redis)

// const twitchBotPoliceDesBois = require('./src/twitch/policeDesBois/bot.js');
// twitchBotPoliceDesBois.start(redis)

// const twitchBotPoliceNationaleDuSwag = require('./src/twitch/policeNationaleDuSwag/bot.js');
// twitchBotPoliceNationaleDuSwag.start()

// const twitchAngelicaWize = require('./src/twitch/angelicaWize/bot.js');
// twitchAngelicaWize.start(redis)

// const twitchPoliceDuProut = require('./src/twitch/policeDuProut/bot.js');
// twitchPoliceDuProut.start(redis)