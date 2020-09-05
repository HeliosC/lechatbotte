var Client = require('ftp');
var c = new Client();

fs = require('fs');
// fs.writeFile("testfile", "Pipe et jambe de bois", [encoding], [callback])

config = {
    host: "poui.ddns.net",
    user: "poui",
    password: "oussama1oussama"
}

c.connect(config);

c.on('ready', function() {
    c.list(function(err, list) {
        if (err) throw err;
        list.forEach(l => console.log(l))
        readFile()
        // c.end();
    });
});

function writeFile(){
    c.put("Pipe et jambe de bois", "/test2.txt", (err) => {
        if (err) throw err
        console.log("File updated")
    })
}

function readFile(){
    c.get("/test2.txt", (err, stream) => {
        if (err) throw err
        stream.pipe(process.stdout)
        process.stdout.write(stream)
        // console.log("File content : " + stream.readable)
        // Object.keys(stream).forEach(key => {
        //     console.log(key)
        // })
    })
}