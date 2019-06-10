const express = require('express');
const exphbs  = require('express-handlebars');
const fs = require('fs');
const app = express();
const port = process.env.PORT || 5000;
const path = require('path')

app.use(express.static('public'));

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, '/views'));
app.use(express.static(path.join(__dirname, '/public')));

app.get('/', function (req, res) {
	var monxp = 77966
	var context = {layout: false, lines:[]}
	for (var i = 1; i < 101; i++) {
	    context.lines.push({
	        rank: i,
	        username: "threshbard",
	        avatar_url: "https://static-cdn.jtvnw.net/jtv_user_pictures/xarth/404_user_150x150.png",
	        experience: monxp,
	        level: level(parseInt(monxp)),
	        progress: progress(parseInt(monxp))
	    });
	}
	res.render('index', context);
});



app.listen(port, () => console.log(`Example app listening on port ${port}!`));

//XP avant de up
function xpLeft(xp0) {
    return (xp(level(xp0) + 1) - xp0)
}
//% d'XP du lvl en cours
function progress(xp0) {
    lvl = level(xp0)
    xplvl = xp(lvl)
    return (Math.floor(100 * ((xp0 - xplvl) / (xp(lvl + 1) - xplvl))))
}
//XP totale pour etre un level donné
function xp(level0) {
    return (16 * (level0 * level0 - 1) + 100 * level0)
}
//Level associé a un montant d'XP
function level(xp0) {
    return (Math.floor((Math.sqrt(xp0 + 172.25) - 12.5) / 4))
}
//Entier random
function randInt(minimum, maximum) {
    return Math.floor((Math.random() * (maximum - minimum + 1)) + minimum)
}
//Date au format aaaa/mm
function dateXp() {
    let date = new Date();
    let month = date.getMonth() + 1;
    if (month < 10) {
        month = "0" + month;
    }
    return date.getFullYear() + '/' + month
}