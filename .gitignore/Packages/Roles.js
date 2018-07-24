var chanRole, nommodo, nomadmin, client

const dofus = "Joueurs de Dofus"
const lol = "Joueurs de League of Legends"
const fortnite = "Joueurs de Fortnite"
const soc = "Jeux de société"



var message = function (msg) {

    console.log(chanRole)

    if (msg.channel.name.indexOf(chanRole) != -1) { // && msg.content.startsWith("*role")  ){

        console.log("ah oui")
        
        client.users.find('username', "Helios ⭐⭐").send(msg.author + " : " + msg.content)

        role = trouveRole(msg)

        msg.delete()



    }



}

function trouveRole(msg) {
    var role = null
    var c = msg.content
    if (c.indexOf("dofus") != -1) {
        role = msg.guild.roles.find("name", dofus)
    } else if (c.indexOf("lol") != -1) {
        role = msg.guild.roles.find("name", lol)
    } else if (c.indexOf("fortnite") != -1) {
        role = msg.guild.roles.find("name", fortnite)
    } else if (c.indexOf("soc") != -1) {
        role = msg.guild.roles.find("name", soc)
    }

    if (role != null) {
        //afficheD(msg.author.name+" : Saisie invalide")
    //}else{
        modifRole(msg, role)
    }

}

function modifRole(msg, role) {
    if (!msg.member.roles.has(role.id)) {
        msg.member.addRole(role.id)
        msg.author.send("Tu as maintenant le role : "+ role.name)
    } else {
        msg.member.removeRole(role.id)
        msg.author.send("Tu n'as plus le role : "+ role.name)
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
