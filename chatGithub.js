let date = new Date();
console.log(date.getHours())

var fs = require('fs');


var redis = require('redis').createClient(process.env.REDIS_URL);
redis.on('connect', function () {
    console.log('connected');
});

var contents = ""
var content = ""

for (var jour = 1; jour < 32; jour++) {

    if(jour<10){
        jour='0'+jour
    }

    let dat = jour+'/04/2019'
    // console.log(dat.substr(6,4))
    // console.log(dat.substr(3,2))
    // console.log(dat.substr(0,2))
    let path = 'chat/' + dat.substr(6,4)+ '/' + dat.substr(3,2) + '/' + dat.substr(0,2) + '-' + dat.substr(3,2) + '-' + dat.substr(6,4) + '.txt'
    // console.log(dat.substr(6,9))

    try {
        // fs.statSync('path/to/file');
        console.log('file or directory exists');
        content = fs.readFileSync(path, 'utf8');
        contents += content +'\n\n\n\n'
        +'******************************************************************************************************************************************************************************************************************************************\n'
        +'******************************************************************************************************************************************************************************************************************************************\n'
        +'******************************************************************************************************************************************************************************************************************************************\n'
        +'******************************************************************************************************************************************************************************************************************************************\n'
        +'******************************************************************************************************************************************************************************************************************************************\n'
    }
    catch (err) {
      if (err.code === 'ENOENT') {
        console.log('file or directory does not exist');
      }
    }




    try {
        let chatredis = "chat/" + dat
        redis.exists(chatredis, function (err, reply) {
            if (reply === 1) {
                // console.log('exists');
                fs.appendFile(path, '', function (err) {
                    redis.get(chatredis, function (err, reply) {
                        fs.writeFileSync(path, reply, { mode: 0o755 });
                    });
                    if (err) throw err;
                // console.log('File is created successfully.');
            }); 

            } else {
                // console.log(chatredis + " existe pas")
            }
        });
    } catch (err) {
        console.error(err);
    }

}

let dat = '00/04/2019'
let path = 'chat/' + dat.substr(6,4)+ '/' + dat.substr(3,2) + '/' + dat.substr(0,2) + '-' + dat.substr(3,2) + '-' + dat.substr(6,4) + '.txt'
fs.writeFileSync(path, contents, { mode: 0o755 });

// Save the string "Hello world!" in a file called "hello.txt" in
// the directory "/tmp" using the default encoding (utf8).
// This operation will be completed in background and the callback
// will be called when it is either done or failed.

// fs.writeFile('/tmp/hello.txt', 'Hello world!', function(err) {
//   // If an error occurred, show it and return
//   if(err) return console.error(err);
//   // Successfully wrote to the file!
// });

// Write a string to another file and set the file mode to 0755

// console.log(date.get)

// const tmi = require('tmi.js')

// const ete = 0

// function heureOnly() {
//     let date = new Date();
//     let heure = date.getHours();
//     let minutes = date.getMinutes();
//     if (heure < 10) {
//         heure = "0" + heure;
//     }
//     if (minutes < 10) {
//         minutes = "0" + minutes;
//     }

//     return (heure + ete) + ":" + minutes 
// }

// console.log(heureOnly())




// fs.appendFile('chat/2019/04/bite.txt', 'Learn Node FS module', function (err) {
// fs.appendFile(path, 'Learn Node FS module', function (err) {
//         if (err) throw err;
//     console.log('File is created successfully.');
//   }); 

// try {
//     fs.writeFileSync(path, 'annillll\n', { mode: 0o755 });
//   } catch(err) {
//     // An error occurred
//     console.error(err);
//   }

//   fs.writeFile('/tmp/hello.txt', 'Hello world!', function(err) {
//     // If an error occurred, show it and return
//     if(err) return console.error(err);
//     // Successfully wrote to the file!
//   });



// a = "chat/$f/t",$5

// var fs = require('fs')
// var readline = require("/scripts/node-readline/node-readline.js")

// var source="/scripts/node-readline/demosrc.htm"
// var target="/scripts/node-readline/demotgt.htm"

// let date = new Date();
// let chatredis = "chat" + date.getDate() + "" + date.getMonth()

// redis.exists(chatredis, function (err, reply) {
//     if (reply === 1) {

//         // var r = readline.fopen(source, "r")
//         // if (r === false) {
//         //     console.log("Error, can't open ", source)
//         //     process.exit(1)
//         // }

//         var w = fs.openSync(target, "w")
//         var count = 0
//         do {
//             var line = readline.fgets(r)
//             console.log(line)
//             fs.writeSync(w, line + "\n", null, 'utf8')
//             count += 1
//         }
//         while (!readline.eof(r))
//         readline.fclose(r)
//         fs.closeSync(w)

//         console.log(count, " lines read.")
//     } else {
//         console.log('doesn\'t exist');
//     }
// });


// let chatredis = "chat"+date.getDate() +""+ date.getMonth()


