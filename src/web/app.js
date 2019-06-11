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

var redis = require('redis').createClient(process.env.REDIS_URL);
redis.on('connect', function () {
    console.log('connected');
});

app.get('/', function (req, res) {
	var context = {layout: false, lines:[]}
	redis.zrevrange('ranking/xp/2019/06', 0, -1, 'WITHSCORES',function(err, scores){
		console.log(scores)
		for (var i = 0; i < scores.length/2; i++) {
			// console.log(i,scores.length/2-1)
			let max = scores.length/2
			console.log("max0", i,max)
			let xp0=scores[2*i+1]
			console.log(xp0)
			console.log(scores[2*i])
			let id=scores[2*i]
			redis.hget('ranking/username', id, function(err,username){
				redis.hget('ranking/logo', id, function(err,logo){
					redis.zrevrank('ranking/xp/2019/06', id, function(err,rank){
						console.log(username,logo)
						console.log("max", i,max)
						context.lines.push({
							rank: rank+1,
							username: username,
							avatar_url: logo,
							experience: xp0,
							level: level(parseInt(xp0)),
							progress: progress(parseInt(xp0))
						});
						if(rank+1==max){
							console.log("ouais")
							res.render('classement', context);
						}
					})
				})
			})
		}
	})
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