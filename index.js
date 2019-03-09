const lechatbotte = require('./src/discord/lechatbotte');
const twitchBotHelios = require('./src/twitch/heliosDesBois/bot.js');
const twitchBotPolice = require('./src/twitch/policeNationaleDuSwag/bot.js');

lechatbotte.start()

twitchBotHelios.start()
twitchBotPolice.start()
