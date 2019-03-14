module.exports = {
    options: {
        debug: false
    },
    connection: {
        reconnect:  true
    },
    identity: {
        username: "PoliceDesBois",
        password: process.env.police
    },
    channels: [
        "heliosdesbois",
        // "kraoki",
        "chatdesbois"
        //"TeamLDLC"
    ]
};
