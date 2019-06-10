module.exports = {
    options: {
        debug: false
    },
    connection: {
        reconnect:  true
    },
    identity: {
        username: "PoliceNationaleDuSwag",
        password: process.env.policeSwag
    },
    channels: [
        //"heliosdesbois",
        "kraoki"
        //"chatdesbois"
        //"TeamLDLC"
    ]
};
