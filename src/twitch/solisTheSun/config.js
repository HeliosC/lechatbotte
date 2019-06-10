module.exports = {
    options: {
        debug: false
    },
    connection: {
        reconnect:  true
    },
    identity: {
        username: "Solis_The_Sun",
        password: process.env.solis
    },
    channels: [
        "heliosdesbois",
        // "kraoki",
        "chatdesbois"
        //"TeamLDLC"
    ]
};
