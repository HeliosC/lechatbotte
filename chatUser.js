var fs = require('fs');

let username = ".+desbois"
let dat = '00/04/2019'


let path = 'chat/' + dat.substr(6, 4) + '/' + dat.substr(3, 2) + '/' + dat.substr(0, 2) + '-' + dat.substr(3, 2) + '-' + dat.substr(6, 4) + '.txt'
let pathUser = 'chat/users/' + username + '.txt'
var text = fs.readFileSync(path, 'utf8')

var str = ""
var s = ""
var exp = "" + username + ""
var regex = new RegExp("[0-9]{2}:[0-9]{2} \\[" + username + "\\] : .*\\n|(\\n|^)\\*{32} Chat du [0-9]{2}\\/[0-9]{2}\\/[0-9]{4} \\*{32}\\n", "gmi");
text.match(regex).forEach(function (element) {
        if (!(/\*{32} Chat du [0-9]{2}\/[0-9]{2}\/[0-9]{4} \*{32}\n/gmi.test(element) && /\*{32} Chat du [0-9]{2}\/[0-9]{2}\/[0-9]{4} \*{32}\n/gmi.test(s))) {
                str += s
        }
        s = element
});
if (!/\*{32} Chat du [0-9]{2}\/[0-9]{2}\/[0-9]{4} \*{32}\n/gmi.test(s)) {
        str += s
}

fs.appendFile(pathUser, '', function (err) {
        fs.writeFileSync(pathUser, str, { mode: 0o755 });
        if (err) throw err;
});
