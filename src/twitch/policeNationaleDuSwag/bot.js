const tmi = require('tmi.js')

const tmiConfig = require("./config")

const request = require('request')

function startBot() {
    let client = new tmi.client(tmiConfig);
    client.connect().then(_ => {
        console.log(`${tmiConfig.identity.username} logged in on twitch !`)
    }).catch(console.error);

    /* bot variables */
    //var massacres = 0;


    client.on("whisper", function (from, userstate, message, self) {
        if (self) return;

        let m = message.toLowerCase()

    });

    client.on('chat', (channel, user, message, isSelf) => {
        if (isSelf) return;

        let m = message.toLowerCase()

        /* Specific to kraoki's channel */
        if (channel.indexOf("kraoki") != -1) {

            if (m.startsWith("arretez")) {
                console.log(channel)
                request('https://tmi.twitch.tv/group/user/'+channel.slice(1)+'/chatters', function (error, response, body) {
                    if (!error && response.statusCode == 200) {
                        let data = JSON.parse(body)
                        let viewers = Object.values(data.chatters).reduce((accumulator, array) => accumulator.concat(array), [])
                        let words = message.split(" ")
                        if(words.length > 0 ){
                            let word = words[1]
                            if(word.toLowerCase()!="heliosdesbois" && viewers.indexOf(word.toLowerCase())!=-1){
                                client.say(channel, word + ", vous êtes en état d'arrestation !");
                            }
                        }
                    } else {
                        console.error("unable ")
                    }
                })
            }


        }
    });
}


module.exports.start = startBot;
