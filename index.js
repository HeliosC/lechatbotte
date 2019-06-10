const lechatbotte = require('./src/discord/lechatbotte');
// const twitchBotHeliosDesBois = require('./src/twitch/heliosDesBois/bot.js');
const twitchBotPoliceDesBois = require('./src/twitch/policeDesBois/bot.js');
// const twitchBotPouiDesBois = require('./src/twitch/pouiDesBois/bot.js');
const twitchBotPoliceNationaleDuSwag = require('./src/twitch/policeNationaleDuSwag/bot.js');
// const twitchBotSolisTheSun = require('./src/twitch/solisTheSun/bot.js');

// This require will start the web
require('./src/web/app.js');

lechatbotte.start()

// twitchBotHeliosDesBois.start()
twitchBotPoliceDesBois.start()
// twitchBotPouiDesBois.start()
twitchBotPoliceNationaleDuSwag.start()
// twitchBotSolisTheSun.start()
