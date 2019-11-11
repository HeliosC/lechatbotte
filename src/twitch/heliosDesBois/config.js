module.exports = {
    options: {
        debug: false
    },
    connection: {
        reconnect:  true
    },
    identity: {
        username: "HeliosDesBois",
        password: process.env.helios
    },
    channels: [
        //"heliosdesbois",
        // "kraoki",
        "chatdesbois"//,
        //"TeamLDLC"
    ]
};
