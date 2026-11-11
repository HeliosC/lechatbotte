module.exports = {
    identity: {
        //username: "MadelineDesChamps",
        //password: process.env.BOT_TWITCH_HELIOS_SECRET,
        botUserId: 1497754093,
        clientId: process.env.BOT_TWITCH_HELIOS_CLIENT_ID,
        clientSecret: process.env.BOT_TWITCH_HELIOS_SECRET
    },
    channels: [
        91251549,
    ],
    scope: [
        "chat:read",
        "chat:edit"
    ]
};