var fs = require('fs');

let word = "massacre"
let dat = '00/04/2019'


let path = 'chat/' + dat.substr(6, 4) + '/' + dat.substr(3, 2) + '/' + dat.substr(0, 2) + '-' + dat.substr(3, 2) + '-' + dat.substr(6, 4) + '.txt'
let pathWord = 'chat/words/' + word + '.txt'
var text = fs.readFileSync(path, 'utf8')

var str = ""
var s = ""
var regex = new RegExp("[0-9]{2}:[0-9]{2} \\[.+\\] : .*" + word + ".*\\n|(\\n|^)\\*{32} Chat du [0-9]{2}\\/[0-9]{2}\\/[0-9]{4} \\*{32}\\n", "gmi");
text.match(regex).forEach(function (element) {
        if (!(/\*{32} Chat du [0-9]{2}\/[0-9]{2}\/[0-9]{4} \*{32}\n/gmi.test(element) && /\*{32} Chat du [0-9]{2}\/[0-9]{2}\/[0-9]{4} \*{32}\n/gmi.test(s))) {
                str += s.replace(word,"*"+word+"*")
        }
        s = element
});
if (!/\*{32} Chat du [0-9]{2}\/[0-9]{2}\/[0-9]{4} \*{32}\n/gmi.test(s)) {
        str += s.replace(word,"*"+word+"*")
}

fs.appendFile(pathWord, '', function (err) {
        fs.writeFileSync(pathWord, str, { mode: 0o755 });
        if (err) throw err;
});
