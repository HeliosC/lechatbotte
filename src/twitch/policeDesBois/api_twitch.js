const clientID = process.env.clientID
const Sheets = {
    kraoki : process.env.SheetKrao,
    chatdesbois : process.env.SheetCDB,
    willokhlass : process.env.SheetWillo
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


function allclips(broadcaster, period, cursor){
    // console.log("Clips " + period + " " + broadcaster);
    return apiclips(broadcaster, period, cursor).then( response => {
        var clips = response.clips
        newcursor = response._cursor
        if(newcursor != "") {
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
        api.clips.top({
            limit : 100,
            channel: broadcaster,
            cursor: cursor, 
            period: period
        }, (err, res) => {
            if(!err){
                resolve(res)
            }else{
                reject("apiclips failed")
            }

        })
    })
}




broadcasterslist = ["chatdesbois", "kraoki", "willokhlass"]


function start(sender, arg){
    
    if(sender != undefined){
        if(broadcasterslist.indexOf(arg) != -1){
            var broadcasters = [arg]
        }else if(sender == "heliosdesbois"){
            var broadcasters = broadcasterslist
        }
        // console.log(sender, arg)
    }else{
        var broadcasters = broadcasterslist
    }


    const tasks = [];

    broadcasters
    // ["willokhlass"]
    .forEach(broadcaster => {
        let promises = ["day", "week", "month", "all"]
            .map(period => allclips(broadcaster, period, "", []))
            // console.log("promises    ", promises)
        Promise.all(promises).then(clipsPerPeriod => {
            let clips = clipsPerPeriod.reduce((accumulator, array) => accumulator.concat(array), [])
            // console.log("lenght ", clips.length)
            var urlSet = {}
            var clips2 = []
            var clips2 = clips.filter(clip => {
                if(urlSet[clip.url]) {
                    return false;
                }
                urlSet[clip.url] = true;
                return true;
            })
            // console.log("lenght 2 ", clips2.length)
            // console.log("lenght 2 ", urlSet)
            // flatMap(clipsArray => clipsArray);
            let data = clips2.map(clip => [
                clip.title, 
                clip.views, 
                clip.game, 
                date(clip.created_at), 
                clip.curator.display_name, 
                clip.url
            ]);
            googleClient.authorize(function(err,tokens){
                if(err){
                    console.log(err);
                    throw err;
                }
                // return 
                gsrun(googleClient, data, broadcaster)
            });
        });
    })

    // console.log(tasks)
    // console.log("zepartiiiiiii")


    // return 
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