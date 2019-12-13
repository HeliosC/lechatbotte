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


/*function allclips(cursor, clips, data, broadcaster, period){
    return new Promise((resolve, reject) => {
        console.log("Clips " + period + " " + broadcaster);
        return api.clips.top({
            limit : 100,
            channel: broadcaster,
            cursor: newcursor, 
            period: period,
        });
    }).then( response => {
        response.clips.forEach(clip => {
            data.push([clip.title, clip.views, clip.game, date(clip.created_at), clip.curator.display_name, clip.url])
        });
        clips = clips.concat(response.clips)
        newcursor = response._cursor
        if(newcursor.length != 0){
            allclips(newcursor, clips, data, broadcaster, period)
        } else{
            googleClient.authorize(function(err,tokens){
                if(err){
                    console.log(err);
                    reject(err);
                    return
                }
                gsrun(googleClient, data, broadcaster).then( _ => {
                    resolve();
                })
            });
        }
    })
}*/


// function allclips(broadcaster, period, cursor){
//    // console.log("Clips " + period + " " + broadcaster);
//     return apiclips(broadcaster, period, cursor).then( response => {
//        // console.log("pas fin all clips "+cursor)
//         var clips = response.clips
//         newcursor = response._cursor
//         // console.log("cursor", newcursor, clips)
//         if(newcursor != "") {
//             return allclips(broadcaster, period, newcursor).then(followingClips => {
//                // console.log("pas fin all clips")
//                 return clips.concat(followingClips);
//             });
//         } else{
//            // console.log("fin all clips")
//             return clips;
//         }
//     })
// }

// function apiclips(broadcaster, period, cursor){
//     return new Promise( (resolve, reject) => {
//         api.clips.top({
//             limit : 100,
//             channel: broadcaster,
//             cursor: cursor, 
//             period: period
//         }, (err, res) => {
//             if(!err){
//                 console.log(res)
//                 resolve(res)
//             }else{
//                 reject("apiclips failed")
//             }

//         })
//     })
// }

function allclips(broadcaster, period, cursor){
    //console.log("Clips " + period + " " + broadcaster);
     return apiclips(broadcaster, period, cursor).then( response => {
        // console.log("pas fin all clips "+cursor)
        
        if(response != "apiclips failed") {
 
        var clips = response.data
        newcursor = response.pagination.cursor
         //if(newcursor != "") {
         // console.log("cursor", newcursor, clips)
             return allclips(broadcaster, period, newcursor).then(followingClips => {
                // console.log("pas fin all clips")
                 return clips.concat(followingClips);
             });
         } else{
            // console.log("fin all clips")
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
  //           +"&started_at=2015-06-01T01:00:00Z"
  //           +"&ended_at=2019-12-30T01:00:00Z"  
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
                 //console.log("yo")
                 data = JSON.parse(body)
                 //console.log(data.pagination.cursor)
                 resolve(data)
             }else{
                 if(response.statusCode != 400){
                     console.log("api failed "+response.statusCode)
                 }
                 resolve("apiclips failed")
 
                 //reject("apiclips failed")
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
            //console.log("helios")
        }
        // console.log(sender, arg)
    }else{
        var broadcasters = broadcasterslist
        //console.log("undef")
    }


    const tasks = [];

    // broadcasters
    // //["willokhlass"]
    // //["kraoki"]
    // .forEach(broadcaster => {
    //     let promises = ["day", "week", "month", "all"]
    //         .map(period => allclips(broadcaster, period, "", []))
    //         console.log("promises    ", promises)
    //     Promise.all(promises).then(clipsPerPeriod => {
    //         console.log("allo les promesses")
    //         let clips = clipsPerPeriod.reduce((accumulator, array) => accumulator.concat(array), [])
    //         console.log("lenght ", clips.length)
    //         var urlSet = {}
    //         var clips2 = []
    //         var clips2 = clips.filter(clip => {
    //             if(urlSet[clip.url]) {
    //                 return false;
    //             }
    //             urlSet[clip.url] = true;
    //             return true;
    //         })
    //         // console.log("lenght 2 ", clips2.length)
    //         // console.log("lenght 2 ", urlSet)
    //         // flatMap(clipsArray => clipsArray);
    //         let data = clips2.map(clip => [
    //             clip.title, 
    //             clip.views, 
    //             clip.game, 
    //             date(clip.created_at), 
    //             clip.curator.display_name, 
    //             clip.url
    //         ]);
    //         googleClient.authorize(function(err,tokens){
    //             if(err){
    //                 console.log(err);
    //                 throw err;
    //             }
    //             // return 
    //             gsrun(googleClient, data, broadcaster)
    //         });
    //     });
    // })

    // console.log(tasks)
    // console.log("zepartiiiiiii")


    // return 

    broadcasters
    //["willokhlass"]
    //["122699636"]
    .forEach(broadcaster => {
        //let promises = ["day", "week", "month", "all"]
        //let promises = [1, 7, 31, 3600]
        let promises = [1, 7, 31, 3600]
            .map(period => allclips(broadcaster, period, "", []))
            //console.log("promises    ", promises)
        Promise.all(promises).then(clipsPerPeriod => {
            //console.log("allo les promesses")
            let clips = clipsPerPeriod.reduce((accumulator, array) => accumulator.concat(array), [])
            //console.log("lenght ", clips.length)
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
            // console.log("lenght 2 ", clips2.length)
            // console.log("lenght 2 ", urlSet)
            // flatMap(clipsArray => clipsArray);
            let gamesid = clips2.map(clip => clip.game_id, );
            var idSet = {}
            var gamesid2 = gamesid.filter(id => {
                if(idSet[id]) {
                    return false;
                }
                idSet[id] = true;
                return true;
            })
            //console.log("gamesidsss : "+gamesid2)

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
                    //console.log(data.data.map(game => game.name))
                    //console.log(data.data.length)
                    gamesnames = {}
                    data0.data.forEach(game => {
                        gamesnames[game.id] = game.name
                    });
                    //gamesnames = data0.data.map(game => game.name)
                    //console.log(gamesnames)

                    let data = clips2.map(clip => [
                        clip.title, 
                        clip.view_count, 
                        //clip.game_id, 
                        //gamesnames[gamesid2.indexOf(clip.game_id)],
                        gamesnames[clip.game_id],
                        date(clip.created_at), 
                        clip.creator_name, 
                        clip.url
                    ]);
                    //console.log("data.length")
                    //console.log(data.length)
                    //console.log(data[1])
                    
                    googleClient.authorize(function(err,tokens){
                        if(err){
                            console.log(err);
                            throw err;
                        }
                        // return 
                        gsrun(googleClient, data, broadcaster)
                    });

                }else{
                    console.log("api failed "+response.statusCode)
                }
            });



            
        });
    })
}

// async 
function gsrun(cl, salut, broadcaster){
    return new Promise( (resolve, reject) => {



    const gsapi = google.sheets({version:'v4', auth: cl});

    const opturl = {
        spreadsheetId: Sheets[broadcaster],
        range: 'Clips!F:F'
        };
    // let dataurl = await gsapi.spreadsheets.values.get(opturl)
    // let dataurl = await 
    // return 
    gsapi.spreadsheets.values.get(opturl).then(dataurl => {

    // })
    var valeursurl = dataurl.data.values
    var urls = []
    valeursurl.forEach(a => {
        urls.push(a[0])
    })

    // console.log("urls", urls.length, urls)

    const opt = {
        spreadsheetId: Sheets[broadcaster],
        range: 'Clips!A:F'
    };
    // let data = await 
    gsapi.spreadsheets.values.get(opt).then( data => {

    var valeurs = data.data.values
    // console.log("valeursAV", valeurs.length, valeurs)
    salut.forEach( slt => {
        var index = urls.indexOf(slt[5]) 
        if (index == -1){
            valeurs.push(slt)
        }else{
            valeurs[index] = slt
        }
    })
    // console.log("valeursAP", valeurs.length, valeurs)


    var updateOpt = {
        spreadsheetId: Sheets[broadcaster],
        range: "Clips!A:F",
        valueInputOption: 'USER_ENTERED',
        resource : {
            majorDimension: "ROWS",
            values: valeurs
        }
    };
    // await 
    gsapi.spreadsheets.values.update(updateOpt).then( _ => {

        // console.log("Clips " + broadcaster)
    
        resolve("fini")
// })

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