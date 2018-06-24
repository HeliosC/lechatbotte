var client
var testo = false

var message = function(msg) {
    /*if (msg.content == "***bite***" && msg.author.username == "Helios" && msg.channel.name == "testbotquiz") {
        testo = true
        msg.channel.send("last deploy : 0 h 1")
    }*/

    if (testo && msg.author.bot) {
        MSG = msg
        testo = false
        test()
    }
}

var testsleepauto = function() {
    testo = true
    client.channels.find('name', "testbotquiz").send("last deploy : 0 h 1")
}

var I = 1
function test() {
    setTimeout(() => {
        I = I + 1
        MSG.edit("last deploy : " + Math.trunc(I/60) + " h " + I%60)
        test()
    }, 60 * 1000);
}

var setParam = function(Mclient){
    client = Mclient
}

exports.message = message
exports.testsleepauto = testsleepauto
exports.setParam = setParam
