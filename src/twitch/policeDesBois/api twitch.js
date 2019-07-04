const clientID = process.env.clientID
const Sheets = {
    kraoki : process.env.SheetKrao,
    chatdesbois : process.env.SheetCDB,
    willokhlass : process.env.SheetWillo
}

var api = require('twitch-api-v5')
api.clientID = clientID

const request = require('request')
// var salut = []

// const keys = require('./keys.json')

// console.log(process.env.GAPI_private_key)

// var fs = require('fs');
// let path = 'testclipsKrao.txt' 

const {google} = require('googleapis');
// const keys = require('./keys.json');

const client = new google.auth.JWT(
    process.env.GAPI_email,
    null,
    process.env.GAPI_private_key.replace(/\\n/g, '\n'),
    // keys.private_key,
    ['https://www.googleapis.com/auth/spreadsheets']
);


function allclips(newcursor, clips, salut, broadcaster){
    api.clips.top({limit:100, channel:broadcaster, cursor:newcursor, period:'day'}, (err, res) => {
        if(!err) {
            res.clips.forEach(clip => {
                salut.push([clip.title, clip.views, clip.game, clip.created_at, clip.curator.display_name, clip.url])
            });
            clips = clips.concat(res.clips)
            newcursor = res._cursor
            console.log(broadcaster, newcursor)
            if(newcursor.length != 0){
                allclips(newcursor, clips, salut, broadcaster)
            }else{
                client.authorize(function(err,tokens){
                    
                    if(err){
                        console.log(err);
                        return;
                    } else {
                        console.log('GAPI connected')
                        gsrun(client, salut, broadcaster);
                    }
                });
                return (salut)
            }
        }
    })
}

function start(){
    // salut=[]
    allclips('', [], [], "kraoki")
    allclips('', [], [], "chatdesbois")
    allclips('', [], [], "willokhlass")   
}

async function gsrun(cl, salut, broadcaster){

    const gsapi = google.sheets({version:'v4', auth: cl});

      const opt = {
          spreadsheetId: Sheets[broadcaster],
          range: 'Clips!D:D'
        };

        let data = await gsapi.spreadsheets.values.get(opt)
        var valeurs = data.data.values
        var valeurs2 = []
        valeurs.forEach(a => {
            valeurs2.push(a[0])
        })
        var salut2 = []

        salut.forEach( slt => {
            if (valeurs2.indexOf(slt[3]) == -1){
                salut2.push(slt)
            }
        });

        // console.log(salut2)
        const payload = {
        spreadsheetId: Sheets[broadcaster],
        range: "Clips!A1:F"+(salut.length+1),
        valueInputOption: 'USER_ENTERED',
        resource : {
          majorDimension: "ROWS",
          values: salut2
        }
      }

      await gsapi.spreadsheets.values.append(payload)

}


exports.start = start