const clientID = process.env.clientID
const SPREADSHEET_ID = process.env.SheetKrao;

var api = require('twitch-api-v5')
api.clientID = clientID

const request = require('request')
var salut = []

// var fs = require('fs');
// let path = 'testclipsKrao.txt' 

const {google} = require('googleapis');
// const keys = require('./keys.json');

const client = new google.auth.JWT(
    process.env.GAPI_email,
    null,
    process.env.GAPI_private_key,
    // keys.private_key,
    ['https://www.googleapis.com/auth/spreadsheets']
);


function allclips(newcursor, clips){
    api.clips.top({limit:100, channel:'kraoki', cursor:newcursor, period:'day'}, (err, res) => {
        if(!err) {
            res.clips.forEach(clip => {
                salut.push([clip.title, clip.views, clip.game, clip.created_at, clip.curator.display_name, clip.url])
            });
            clips = clips.concat(res.clips)
            newcursor = res._cursor
            if(newcursor.length != 0){
                allclips(newcursor, clips)
            }else{
                client.authorize(function(err,tokens){
                    
                    if(err){
                        console.log(err);
                        return;
                    } else {
                        console.log('Connected')
                        gsrun(client);
                    }
                });
                return (salut)
            }
        }
    })
}

allclips('', [])

async function gsrun(cl){

    const gsapi = google.sheets({version:'v4', auth: cl});

      const opt = {
          spreadsheetId: SPREADSHEET_ID,
          range: 'Data!D:D'
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

        const payload = {
        spreadsheetId: SPREADSHEET_ID,
        range: "Data!A1:F"+salut.length,
        valueInputOption: 'USER_ENTERED',
        resource : {
          majorDimension: "ROWS",
          values: salut2
        }
      }

      await gsapi.spreadsheets.values.append(payload)

}


exports.start = allclips