const clientID = process.env.clientID
const oauth = process.env.oauthhelios
// const Sheets = {
//     kraoki : process.env.SheetKrao,
//     chatdesbois : process.env.SheetCDB,
//     willokhlass : process.env.SheetWillo,
//     poulpita : process.env.SheetPoulpi,
//     lageekenrose : process.env.SheetLGER
// }
const Sheets = {
    49041281 : process.env.SheetKrao,
    122699636 : process.env.SheetCDB,
    185261350 : process.env.SheetWillo,
    204501281 : process.env.SheetPoulpi,
    112826022 : process.env.SheetLGER
}

var api = require('twitch-api-v5')
api.clientID = clientID

const request = require('request')

const {google} = require('googleapis');

const googleClient = new google.auth.JWT(
    process.env.GAPI_email,
    null,
    process.env.GAPI_private_key.replace(/\\n/g, '\n'),
    ['https://www.googleapis.com/auth/spreadsheets']
);

function allclips(broadcaster, period, cursor){
     return apiclips(broadcaster, period, cursor).then( response => {
        
        if(response != "apiclips failed") {
        var clips = response.data
        newcursor = response.pagination.cursor
             return allclips(broadcaster, period, newcursor).then(followingClips => {
                 return clips.concat(followingClips);
             });
         } else{
             return clips;
         }
     })
 }
 
 function apiclips(broadcaster, period, cursor){
     return new Promise( (resolve, reject) => {
 
         var actualDate = new Date();
         var targetDate = new Date();
         targetDate.setDate(targetDate.getDate() - period);
 
         var options = {
             url: "https://api.twitch.tv/helix/clips?broadcaster_id="+broadcaster+"&first=100&after="+cursor
             +"&started_at=" + targetDate.toISOString()
             +"&ended_at="   + actualDate.toISOString()  
             ,
             method: "GET",
             headers: {
             "Authorization": "Bearer "+oauth
             }
         };
     
         request(options, function (error, response, body) {
             if (response && response.statusCode == 200) {
                 data = JSON.parse(body)
                 resolve(data)
             }else{
                 if(response.statusCode != 400){
                     console.log("api failed "+response.statusCode)
                 }
                 resolve("apiclips failed")
             }
         });
 
 
     })
 }



broadcastersnamelist = ["chatdesbois", "kraoki", "willokhlass", "poulpita", "lageekenrose"]
broadcasterslist = ["122699636", "49041281", "185261350", "204501281", "112826022"]

function start(sender, arg){
    
    if(sender != undefined){
        if(broadcasterslist.indexOf(arg) != -1){
            var broadcasters = [broadcasterslist[broadcastersnamelist.indexOf(arg)]]
        }else if(sender == "heliosdesbois"){
            var broadcasters = broadcasterslist
        }
    }else{
        var broadcasters = broadcasterslist
    }

    const tasks = [];

    broadcasters.forEach(broadcaster => {
        let promises = [1, 7, 31, 3600]
            .map(period => allclips(broadcaster, period, "", []))
        Promise.all(promises).then(clipsPerPeriod => {
            let clips = clipsPerPeriod.reduce((accumulator, array) => accumulator.concat(array), [])
            var urlSet = {}
            var clips2 = []
            var clips2 = clips.filter(clip => {
                if(clip != undefined){
                    if(urlSet[clip.url]) {
                        return false;
                    }
                    urlSet[clip.url] = true;
                    return true;
                }else{
                    return false
                }
            })
            let gamesid = clips2.map(clip => clip.game_id, );
            var idSet = {}
            var gamesid2 = gamesid.filter(id => {
                if(idSet[id]) {
                    return false;
                }
                idSet[id] = true;
                return true;
            })

            //CHERCHER LES JEUX
            var options = {
                url: "https://api.twitch.tv/helix/games?id="+gamesid2.join("&id="),
                method: "GET",
                headers: {
                "Authorization": "Bearer "+oauth
                }
            };
            request(options, function (error, response, body) {
                if (response && response.statusCode == 200) {
                    data0 = JSON.parse(body)
                    gamesnames = {}
                    data0.data.forEach(game => {
                        gamesnames[game.id] = game.name
                    });

                    let data = clips2.map(clip => [
                        clip.title, 
                        clip.view_count, 
                        gamesnames[clip.game_id],
                        date(clip.created_at), 
                        clip.creator_name, 
                        clip.url
                    ]);
                    
                    googleClient.authorize(function(err,tokens){
                        if(err){
                            console.log(err);
                            throw err;
                        }
                        gsrun(googleClient, data, broadcaster)
                    });

                }else{
                    console.log("api failed "+response.statusCode)
                }
            });
        });
    })
}

function gsrun(cl, salut, broadcaster){
    return new Promise( (resolve, reject) => {

        const gsapi = google.sheets({version:'v4', auth: cl});

        const opturl = {
            spreadsheetId: Sheets[broadcaster],
            range: 'Clips!F:F'
            };

        gsapi.spreadsheets.values.get(opturl).then(dataurl => {
            var valeursurl = dataurl.data.values
            var urls = []
            valeursurl.forEach(a => {
                urls.push(a[0])
            })

            const opt = {
                spreadsheetId: Sheets[broadcaster],
                range: 'Clips!A:F'
            };
            gsapi.spreadsheets.values.get(opt).then( data => {

                var valeurs = data.data.values
                salut.forEach( slt => {
                    var index = urls.indexOf(slt[5]) 
                    if (index == -1){
                        valeurs.push(slt)
                    }else{
                        valeurs[index] = slt
                    }
                })

                var updateOpt = {
                    spreadsheetId: Sheets[broadcaster],
                    range: "Clips!A:F",
                    valueInputOption: 'USER_ENTERED',
                    resource : {
                        majorDimension: "ROWS",
                        values: valeurs
                    }
                };
                gsapi.spreadsheets.values.update(updateOpt).then( _ => {
                    resolve("fini")
                })
            })
        })
    })
}

function date(d){
    return d.substr(8,2) + "/" + d.substr(5,2) + "/" + d.substr(0,4) + " " + d.substr(11,8)
}

async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array);
    }
}

exports.start = start