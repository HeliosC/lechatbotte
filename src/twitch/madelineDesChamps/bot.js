require("dotenv").config();
const tmi = require("tmi.js");
const tmiConfig = require("./config")
const { getValidAccessToken, refreshAccessToken } = require("./auth/twitchAuth");
const { loadTokens } = require("./auth/tokenStore");

//startBot()


async function startBot() {
    const tokens = loadTokens();

    if (!tokens) {
        console.error("No tokens found");
        return
    }
    
    try {
        const client = await createClient();
        registerHandlers(client);

        await client.connect().then(_ => {
            console.log(`${tmiConfig.identity.username} logged in on twitch !`)
        }).catch(error => { console.error(`${tmiConfig.identity.username} ${error}`) });        

        scheduleTokenRefresh(client);
    } catch (err) {
        console.error("Twitch bot error on start: ", err.message);
    }
}

async function createClient() {
    const { accessToken } = await getValidAccessToken();

    tmiConfig.identity.password = `oauth:${accessToken}`
    const client = new tmi.client(tmiConfig);

    return client;
}


function onChat(channel, user, message, isSelf) {
    if (isSelf) return;

    //chatlog(channel, user.username, message)

    let m = message.toLowerCase()

}





function registerHandlers(client) {

  client.on("connected", (addr, port) => {
    console.log(`✅ Connecté à Twitch (${addr}:${port})`);
  });

  client.on("disconnected", (reason) => {
    console.warn("⚠️  Déconnecté :", reason);
  });

  client.on("message", (channel, tags, message, self) => {
    if (self) return; // Ignorer les messages du bot lui-même

    const username = tags["display-name"];
    console.log(`[${channel}] ${username}: ${message}`);

    // ── Commandes ──────────────────────────────────────────
    if (message === "!ping") {
      client.say(channel, `@${username} Pong!`);
    }

    if (message === "!bot") {
      client.say(channel, "Je suis un bot Node.js avec tmi.js !");
    }
  });
}




function scheduleTokenRefresh(client) {
    const tokens = loadTokens();
    if (!tokens) return;

    const msUntilExpiry = tokens.expiresAt - Date.now();
    const refreshIn = Math.max(msUntilExpiry - 60_000, 0); // 1 min avant expiry

    console.log(`⏰ Prochain refresh dans ${Math.round(refreshIn / 60000)} min`);

    setTimeout(async () => {
        try {
            console.log("🔄 Rafraîchissement du token...");
            const freshTokens = await refreshAccessToken(tokens.refreshToken);

            // tmi.js ne supporte pas le hot-swap de token natif
            // → reconnexion propre avec le nouveau token
            await client.disconnect();
            client.opts.identity.password = `oauth:${freshTokens.accessToken}`;
            await client.connect();

            console.log("✅ Token rafraîchi, bot reconnecté.");

            // Planifie le prochain refresh
            scheduleTokenRefresh(client);

        } catch (err) {
            console.error("❌ Échec du refresh :", err.message);
            process.exit(1); // Relance via PM2 / systemd si besoin
        }
    }, refreshIn);
}


//-------------- LOGS ---------------------
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
