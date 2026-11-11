module.exports = {
    options: {
        debug: false
    },
    connection: {
        reconnect:  true
    },
    identity: {
        username: process.env.BOT_TWITCH_HELIOS_USERNAME
    },
    channels: [
        process.env.HELIOS_TWITCH_CHANNEL_NAME.toLowerCase()
    ],
    scopes: [
        "chat:read", 
        "chat:edit"
    ]
};