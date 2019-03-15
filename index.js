const lechatbotte = require('./src/discord/lechatbotte');
const twitchBotHeliosDesBois = require('./src/twitch/heliosDesBois/bot.js');
const twitchBotPoliceDesBois = require('./src/twitch/policeDesBois/bot.js');
const twitchBotPouiDesBois = require('./src/twitch/pouiDesBois/bot.js');
const twitchBotPoliceNationaleDuSwag = require('./src/twitch/policeNationaleDuSwag/bot.js');

lechatbotte.start()

twitchBotHeliosDesBois.start()
twitchBotPoliceDesBois.start()
twitchBotPouiDesBois.start()
twitchBotPoliceNationaleDuSwag.start()
