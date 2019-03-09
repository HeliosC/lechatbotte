module.exports = {
    options: {
        debug: true
    },
    connection: {
        reconnect:  true
    },
    identity: {
        username: "PoliceNationaleDuSwag",
        password: process.env.police
    },
    channels: [
        "heliosdesbois",
        "kraoki",
        "chatdesbois"
        //"TeamLDLC"
    ]
};
