module.exports = {
    options: {
        debug: false
    },
    connection: {
        reconnect:  true
    },
    identity: {
        username: "AngelicaWize",
        password: process.env.angelica
    },
    channels: [
        //"poulpita",
        "heliosdesbois"
    ]
};
  