const moderators = ["heliosdesbois", "pioudesbois", "chatdesbois", "solis_the_sun"]

var timeouts = []

function initTimers(channel, client, redis){
    redis.hkeys("timers/descriptions", (err, timers) => {
        timers.forEach(timer => {
            initTimer(channel, timer, client, redis)
        })
    })
}

function initTimer(channel, timer, client, redis){
    console.log("Initilisation du timer : " + timer)
    redis.hget("timers/countdowns", timer,(err, cd) => {
        redis.hget("timers/descriptions", timer, (err, desc) => {
            redis.hget("commands", desc, (err, reply) => {
                if(reply!=null){
                    desc = reply
                }
                if(parseInt(cd) != 0){
                    timeouts.push({
                        "name": timer,
                        "function":
                            setInterval(()=>{
                                client.say(channel, desc)
                            }, parseInt(cd)*60000)
                    })
                }
            })
        })
    })
}

function updateTimer(channel, timer, reCreate, client, redis){
    timeouts.forEach(timeout => {
        if(timeout.name == timer){
            removeTimer(timeout)
            console.log("timer "+timer+" removed")
            if(reCreate){
                initTimer(channel, timer, client, redis)
            }
        }
    })
}

function removeTimer(timeout){
    clearTimeout(timeout.function)
    timeouts.splice(timeouts.indexOf(timeout), 1)
}

function removeAllTimers(){
    timeouts.forEach(timeout => {
        removeTimer(timeout)
    })
}


function chat(channel, user, message, isSelf, client, redis){

    if(isSelf){
        return
    }

    let m = message.toLowerCase();
    let username = user.username;

    var args = message.split(" ")
    if(isModerateur(username)){
        if(args[0] == "!police" && args[1]=="timer"){
            var timer = (args[3] || "").toLowerCase()
            switch (args[2]){
                case "add":
                    redis.hexists("timers/descriptions", timer, (err, exists) => {
                        if(exists){
                            client.say(channel, "Ce timer existe déjà.")
                        }else if(args[5]!=null && args[5]!=undefined){
                            let cd = parseInt(args[4])
                            if(!isNaN(cd)){
                                redis.hset("timers/descriptions", timer, args.slice(5).join(" "), (err, reply) => {
                                    redis.hset("timers/countdowns", timer, cd, (err, reply) => {
                                        client.say(channel, "Timer "+ timer + " créé.")
                                        initTimer(channel, timer, client, redis)
                                    })
                                })
                            }else{
                                client.say(channel, "Syntaxe invalide.")
                            }
                        }else{
                            client.say(channel, "Syntaxe invalide.")
                        }
                    })
                    break
                case "edit":
                    redis.hexists("timers/descriptions", timer, (err, exists) => {
                        if(!exists){
                            client.say(channel, "Ce timer n'existe pas.")
                        }else if(args[4]!=null && args[4]!=undefined){
                            let cd = parseInt(args[4])
                            if(!isNaN(cd)){
                                redis.hset("timers/countdowns", timer, cd, (err, reply) => {
                                    if(args[5]!=null && args[5]!=undefined){
                                        redis.hset("timers/descriptions", timer, args.slice(5).join(" "), (err, reply) => {
                                            client.say(channel, "Description et délai du timer "+ timer + " modifiés.")
                                            updateTimer(channel, timer, true, client, redis)
                                        })
                                    }else{
                                        client.say(channel, "Délai du timer "+ timer + " modifié.")
                                        updateTimer(channel, timer, true, client, redis)
                                    }
                                })
                            }else{
                                redis.hset("timers/descriptions", timer, args.slice(4).join(" "), (err, reply) => {
                                    client.say(channel, "Description du timer "+ timer + " modifiée.")
                                    updateTimer(channel, timer, true, client, redis)
                                })
                            }
                        }else{
                            client.say(channel, "Syntaxe invalide.")
                        }
                    })
                    break
                case "remove":
                    redis.hexists("timers/descriptions", timer, (err, exists) => {
                        if(!exists){
                            client.say(channel, "Ce timer n'existe pas.")
                        }else{
                            redis.hdel("timers/descriptions", timer, (err, reply) => {
                                redis.hdel("timers/countdowns", timer, (err, reply) => {
                                    client.say(channel, "Timer "+ timer + " supprimé.")
                                    updateTimer(channel, timer, false, client, redis)
                                })
                            })
                        }
                    })
                    break
                case "list":
                    redis.hkeys("timers/descriptions", (err, timers) => {
                        let str = ""
                        timers.forEach(element => {
                            str += element + " "
                        });
                        client.say(channel, "Timmers : " + str)
                    })
                    break
                case "info":
                    redis.hexists("timers/descriptions", timer, (err, exists) => {
                        if(!exists){
                            client.say(channel, "Ce timer n'existe pas.")
                        }else{
                            redis.hget("timers/countdowns", timer,(err, cd) => {
                                redis.hget("timers/descriptions", timer, (err, desc) => {
                                    client.say(channel, timer + " : " + cd + " min : \"" + desc + "\"")
                                })
                            })
                        }            
                    })   
                    break
            }
        }
    }
}

function isModerateur(username) {
    return moderators.indexOf(username.toLowerCase()) != -1;
}

exports.chat = chat
exports.initTimers = initTimers
exports.removeAllTimers = removeAllTimers