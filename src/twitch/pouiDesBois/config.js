module.exports = {
    options: {
        debug: false
    },
    connection: {
        reconnect:  true
    },
    identity: {
        username: "PouiDesBois",
        password: process.env.poui
    },
    channels: [
        "heliosdesbois",
        // "kraoki",
        "chatdesbois"
        //"TeamLDLC"
    ]
};
