var chanRole, nommodo, nomadmin, client

const dofus = "Joueurs de Dofus"
const lol = "Joueurs de League of Legends"
const fortnite = "Joueurs de Fortnite"
const soc = "Jeux de société"



var message = function (msg) {

    console.log(chanRole)

    if (msg.channel.name.indexOf(chanRole) != -1) { // && msg.content.startsWith("*role")  ){

        console.log("ah oui")

        role = trouveRole(msg)

        //msg.delete()



    }



}

function trouveRole(msg) {
    var role = "null"
    var c = msg.content
    if (c.indexOf("dofus") != -1) {
        role = msg.guild.roles.find("name", dofus).id
    } else if (c.indexOf("lol") != -1) {
        role = msg.guild.roles.find("name", lol).id
    } else if (c.indexOf("fortnite") != -1) {
        role = msg.guild.roles.find("name", fortnite).id
    } else if (c.indexOf("soc") != -1) {
        role = msg.guild.roles.find("name", soc).id
    }

    //if (role == "null") {
        //afficheD(msg.author.name+" : Saisie invalide")
    //}else{
        modifRole(msg, role)
    //}

}

function modifRole(msg, role) {
    if (!msg.member.roles.has(role)) {
        msg.member.addRole(role)
    } else {
        msg.member.removeRole(role)
    }
}

var setParam = function (Mclient, MchanRole, Mnomadmin, Mnommodo) {
    chanRole = MchanRole
    nomadmin = Mnomadmin
    nommodo = Mnommodo
    client = Mclient
}

exports.message = message
exports.setParam = setParam
