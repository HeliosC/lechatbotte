const moderators = ["heliosdesbois", "pouidesbois", "chatdesbois", "solis_the_sun"]

function chat(channel, user, message, isSelf, client, redis){

    if(isSelf){
        return
    }
    let m = message.toLowerCase();
    let username = user.username;

    var args = message.split(" ")

    if(args[0] == "!addquote" && isModerateur(username)){
        redis.lpush("quotes", args.slice(1).join(" "), (err, reply) => {
        client.say(channel, "Quote ajoutée")
        })
    }else
    if(args[0] == "!addquote"){
        redis.lpush("quotes-temp", args.slice(1).join(" "), (err, reply) => {
            client.say(channel, "Quote proposée")
        })
    }else 
    if(args[0] == "!quote"){
        redis.lrange("quotes", 0, -1, (err, quotes) => {
            let l = quotes.length
            if(l > 0){
                let quote = quotes[randomIntFromInterval(0, l-1)]
                client.say(channel, quote)
            }
        })
    }
    if (args[0] == "!removequote") {
        this.redis.lrem("quotes", 0, args.splice(1).join(" "), (err, response) => {
            if (response == 0) {
                client.say(channel, "Cette quote n'existe pas.")
            } else {
                client.say(channel, "Quote suprimée.")
            }
        })
    }
}

function randomIntFromInterval(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min);
  }  

function isModerateur(username) {
    return moderators.indexOf(username.toLowerCase()) != -1;
}

exports.chat = chat