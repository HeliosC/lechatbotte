//const tmi = require('tmi.js')
//const tmiConfig = require("./config")

//const request = require('request')

const config = require("./configNoTMI")

//const hdb = "heliosdesbois"





const BOT_USER_ID = config.identity.botUserId; // This is the User ID of the chat bot
const OAUTH_TOKEN = 'CHANGE_ME_TO_YOUR_OAUTH_TOKEN'; // Needs scopes user:bot, user:read:chat, user:write:chat

const CLIENT_ID = config.identity.clientId;
const Client_SECRET = config.identity.clientSecret

const CHAT_CHANNEL_USER_ID = config.channels[0]; // This is the User ID of the channel that the bot will join and listen to chat messages of

const EVENTSUB_WEBSOCKET_URL = 'wss://eventsub.wss.twitch.tv/ws';

const scope = config.scope.join('+')


var websocketSessionID;
var websocketClient

async function startBot() {
    // Start executing the bot from here
    //(async () => {
        // Verify that the authentication is valid
        //await getAuth();
        getAuth();

        // Start WebSocket client and register handlers
        //websocketClient = startWebSocketClient();
    //})();

    // WebSocket will persist the application loop until you exit the program forcefully




    return
    let client = new tmi.client(tmiConfig);
    client.connect().then(_ => {
        console.log(`${tmiConfig.identity.username} logged in on twitch !`)
    }).catch(error => { console.error(`${tmiConfig.identity.username} ${error}`) });

    client.on('chat', (channel, user, message, isSelf) => {
        if (isSelf) return;

        chatlog(channel, user.username, message)

        let m = message.toLowerCase()
    });
}




async function getAuth() {
	// https://dev.twitch.tv/docs/authentication/validate-tokens/#how-to-validate-a-token
	let response = await fetch('https://id.twitch.tv/oauth2/validate', {
		method: 'GET',
		headers: {
			'Authorization': 'OAuth ' + OAUTH_TOKEN
		}
	});

	if (response.status != 200) {
		let data = await response.json();
		console.error("Token is not valid. /oauth2/validate returned status code " + response.status);
		console.error(data);
		process.exit(1);
	}

	console.log("Validated token.");
}



const ete = 2
function chatlog(channel, username, message) {
    let redisDate = dateFull()
    let redisDateInv = redisDate.substr(6,4)+redisDate.substr(2,4)+redisDate.substr(0,2)
    let chatredis = 'chat/' + hdb + '/' + redisDateInv

    redis.exists(chatredis, function (err, reply) {
        if (reply === 1) {

            redis.get(chatredis, function (err, reply) {
                redis.set(chatredis, reply + "\n"
                    + heureOnly() + ' [' + username + '] : ' + message);
            });

        } else {
            redis.set(chatredis, "******************************** " + 'Chat du ' + redisDate + " ********************************" + "\n"
                + heureOnly() + ' [' + username + '] : ' + message);
        }
    });
}

function heureOnly() {
    let date = new Date();
    let heure = date.getHours() + ete;
    let minutes = date.getMinutes();
    if (heure < 10) {
        heure = "0" + heure;
    }
    if (minutes < 10) {
        minutes = "0" + minutes;
    }
    return (heure) + ":" + minutes
}

function dateFull() {
    let date = new Date();
    let month = date.getMonth() + 1;
    let jour = date.getDate();
    if (jour < 10) {
        jour = "0" + jour;
    }
    if (month < 10) {
        month = "0" + month;
    }
    return jour + '/' + month + '/' + date.getFullYear()
}

module.exports.start = startBot;
