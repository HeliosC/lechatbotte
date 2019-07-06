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

const client = new google.auth.JWT(
    process.env.GAPI_email,
    null,
    process.env.GAPI_private_key.replace(/\\n/g, '\n'),
    ['https://www.googleapis.com/auth/spreadsheets']
);


function allclips(newcursor, clips, salut, broadcaster, period){
    api.clips.top({limit : 100,
        channel : broadcaster,
        cursor : newcursor, 
        period : period,
    }, (err, res) => {
        if(!err) {
            res.clips.forEach(clip => {
                salut.push([clip.title, clip.views, clip.game, clip.created_at, clip.curator.display_name, clip.url])
            });
            clips = clips.concat(res.clips)
            newcursor = res._cursor
            if(newcursor.length != 0){
                allclips(newcursor, clips, salut, broadcaster, period)
            }else{
                client.authorize(function(err,tokens){
                    if(err){
                        console.log(err);
                        return;
                    } else {
                        gsrun(client, salut, broadcaster);
                    }
                });
            }
        }
    })
}

function start(){
    ["chatdesbois", "kraoki", "willokhlass"]
    // ["chatdesbois"]
    .forEach(broadcaster => {
        ["day", "week", "month", "all"]
        // ["day"]
        .forEach(period => {
            allclips('', [], [], broadcaster, period)
        })
    })
}

async function gsrun(cl, salut, broadcaster){

    const gsapi = google.sheets({version:'v4', auth: cl});

    const opturl = {
        spreadsheetId: Sheets[broadcaster],
        range: 'Clips!F:F'
        };
    let dataurl = await gsapi.spreadsheets.values.get(opturl)
    var valeursurl = dataurl.data.values
    var urls = []
    valeursurl.forEach(a => {
        urls.push(a[0])
    })

    const opt = {
        spreadsheetId: Sheets[broadcaster],
        range: 'Clips!A:F'
    };
    let data = await gsapi.spreadsheets.values.get(opt)
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
    await gsapi.spreadsheets.values.update(updateOpt)
}

exports.start = start