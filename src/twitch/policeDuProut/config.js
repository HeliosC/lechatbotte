module.exports = {
    options: {
        debug: false
    },
    connection: {
        reconnect:  true
    },
    identity: {
        username: "PoliceDuProut",
        password: process.env.policeProut
    },
    channels: [
        "heliosdesbois",
        "melikahchi"
    ]
};
