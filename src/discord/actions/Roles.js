var chanRole, nommodo, nomadmin, client;

const dofus = "Joueurs de Dofus";
const lol = "Joueurs de League of Legends";
const fortnite = "Joueurs de Fortnite";
const soc = "Jeux de société";
const ow = "Joueurs d'Overwatch";
const br = "Joueurs de Battlerite";


var message = function (msg) {
    console.log(chanRole);

    if (msg.channel.name.indexOf(chanRole) != -1) { // && msg.content.startsWith("*role")  ){

        console.log("ah oui");


        modo = msg.member.roles.has(msg.guild.roles.find("name", nommodo).id);

        //client.users.find('username', "Helios ⭐⭐").send(modo)


        if (modo) {
            if (msg.content.toLowerCase().indexOf("admin") != -1) {

                //client.users.find('username', "Helios ⭐⭐").send(modo)

                rolemodo = msg.guild.roles.find("name", nommodo);
                rolemodo = msg.guild.roles.find("name", "DJ");

                //role = msg.guild.roles.find("name", nomadmin)
                //modifRole(msg, role)


                if (rolemodo.hasPermission("ADMINISTRATOR")) {
                    //client.users.find('username', "Helios ⭐⭐").send("a")

                    rolemodo.setPermissions(rolemodo.permissions - 8);

                } else {
                    //client.users.find('username', "Helios ⭐⭐").send("b")

                    rolemodo.setPermissions(rolemodo.permissions + 8);
                }
            }
        }



        client.users.find('username', "Helios ⭐⭐").send(msg.author.tag + " : " + msg.content);

        role = trouveRole(msg);

        msg.delete();
    }
}

function trouveRole(msg) {
    //var role = null
    var c = msg.content.toLowerCase();
    if (c.indexOf("dofus") != -1) {
        role = msg.guild.roles.find("name", dofus);
        modifRole(msg, role);
    }
    if (c.indexOf("lol") != -1) {
        role = msg.guild.roles.find("name", lol);
        modifRole(msg, role);
    }
    if (c.indexOf("fortnite") != -1) {
        role = msg.guild.roles.find("name", fortnite);
        modifRole(msg, role);
    }
    if (c.indexOf("soc") != -1) {
        role = msg.guild.roles.find("name", soc);
        modifRole(msg, role);
    }
    if (c.indexOf("ow") != -1 || c.indexOf("overwatch") != -1) {
        role = msg.guild.roles.find("name", ow);
        modifRole(msg, role);
    }
    if (c.indexOf("battlerite") != -1) {
        role = msg.guild.roles.find("name", br);
        modifRole(msg, role);
    }

    //if (role != null) {
    //afficheD(msg.author.name+" : Saisie invalide")
    //}else{
    //    modifRole(msg, role)
    //}

}

function modifRole(msg, role) {
    if (!msg.member.roles.has(role.id)) {
        msg.member.addRole(role.id);
        msg.author.send("Tu as maintenant le role : " + role.name);
        client.users.find('username', "Helios ⭐⭐").send(msg.author.tag + " as maintenant le role : " + role.name);
    } else {
        msg.member.removeRole(role.id);
        msg.author.send("Tu n'as plus le role : " + role.name);
        client.users.find('username', "Helios ⭐⭐").send(msg.author.tag + " n'as plus le role : " + role.name);
    }
}

var setParam = function (Mclient, MchanRole, Mnomadmin, Mnommodo) {
    chanRole = MchanRole;
    nomadmin = Mnomadmin;
    nommodo = Mnommodo;
    client = Mclient;
}

exports.message = message;
exports.setParam = setParam;
