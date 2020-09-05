const oauth = "fegin3656hdm92sq591z7lvyn5gltc" //New OAUTH
const clientSecret = "n5bjwnucp6yl0jncr1gpb9n7vc5aqx"
const clientID = "uqwo4hoz0wfjvqe0votbv6r0jv7p7t" //chatdesbois' bot
var idchatdesbois = "122699636"

const request = require("request")

var options = {
    url: "https://api.twitch.tv/helix/users/follows?to_id=" + idchatdesbois,
    method: "GET",
    headers: {
        "Authorization": "Bearer " + oauth,
        "Client-ID": clientID                
    }
};

request(options, function (error, response, body) {
    if (response && response.statusCode == 200) {
        let data = JSON.parse(body)
        res = data.data[0]



    } else {
        console.error("unable " + response.statusCode)
    }
})