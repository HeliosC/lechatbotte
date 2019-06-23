"use strict";

const express = require('express');
const exphbs  = require('express-handlebars');
const fs = require('fs');
const app = express();
const port = process.env.PORT || 5000;
const path = require('path')
    
app.use(express.static('public'));
// app.engine('handlebars', exphbs());
// app.engine('handlebars', exphbs({extendname: 'handlebars', defaultLayout: 'main', layoutsDir: __dirname + '/views/layouts/'}));
app.engine('handlebars', exphbs({extendname: 'handlebars', defaultLayout: 'main', layoutsDir: __dirname + '/views/layouts/'}));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, '/views'));
app.use(express.static(path.join(__dirname, '/public')));

var redis = require('async-redis').createClient(process.env.REDIS_URL);
redis.on('connect', function () {
    //console.log('connected');
});

app.get('/user/:username', function (req, res, next) {
	let username = req.params.username.toLowerCase();
	var context = {}
	
	redis.hexists('ranking/id', username).then(exists =>{
		if(!exists){
			res.redirect('/');
			return;
		}
		Promise.all([
			datesList(), 
			getUserInfoFromUsername(username)
		]).then(([dates, userInfo]) => {
			context.dates = dates;
			context.userInfo = userInfo;
			
			dates = ['global'].concat(dates)

			var promises = [];
			dates.forEach(
				(date) => {
					promises.push(getUserMontlyInfo(date, userInfo.id))
			})
			Promise.all(promises).then((montlyInfo) => {
				console.log(montlyInfo)
				context.dateInfo = montlyInfo
				res.render('user', context);
			}).catch(next)

		}).catch(next);
	})
});

function getUserMontlyInfo(date, id){
	date = date == 'global' ? 'global' : date.substr(3,4)+'/'+date.substr(0,2)
	return Promise.all([
		redis.zscore('ranking/xp/'+date, id),
		redis.zrevrank('ranking/xp/'+date, id)
	]).then(([score, rank]) => {
		let lvl = level(parseInt(score));
		rank = rank + 1;
		let lvlColor = lvlcolors[lvl];
		return ({date, lvl, rank, lvlColor})
	})
}


app.get('/', function (req, res) {
	console.log('rien')
  	affichage(res, 'global')
});

app.get('/:tagId', function (req, res) {
	let tag = req.params.tagId
	console.log('rien',tag)
	if(tag=='mensuel'){
  		affichage(res, dateXp())
  	}else if(tag=='global'){
  		affichage(res, 'global')
  	}else{
		tag=tag.substr(3,4)+'/'+tag.substr(0,2)
  		affichage(res, tag)
  	}
});

function affichage(res, date){
	var context = {lines:[]}

	if(date=='global'){
		context.global = 'global'
	} else if(date == dateXp()) {
		context.mois = moisStr[parseInt(date.substr(5, 2)) - 1]
		context.annee = date.substr(0,4)
		context.global = 'en cours'
		context.ligneMois = true
	} else {
		context.mois = moisStr[parseInt(date.substr(5, 2)) - 1]
		context.annee = date.substr(0,4)
		context.ligneMois = true
	}

	Promise.all([
		datesList(),
		getRankingList(date)
	]).then(([dates, lines]) => {
		context.dates = dates;
		context.lines = lines;
		res.render('classement', context);
	});
}

function getRankingList(date) {
	return redis.zrevrange(`ranking/xp/${date}`, 0, -1, 'WITHSCORES').then(scores => {
		var promises = [];
		for (var rank = 0; rank < scores.length / 2; rank++) {
			let max = scores.length / 2;
			let xpUser = scores[2*rank + 1];
			let id = scores[2*rank];
			promises.push(getRankingLine(date, id, xpUser, rank));
		}
		return Promise.all(promises);
	});
}

function getRankingLine(date, id, xpUser, rank) {
	return getUserDetails(id).then(({username, color, logo}) => {
		return {
			rank: rank + 1,
			username: username,
			avatar_url: logo,
			experience: xpUser,
			level: level(parseInt(xpUser)),
			progress: progress(parseInt(xpUser)),
			lvlcolor: lvlcolors[Math.min(Math.floor(level(parseInt(xpUser)) / 10), 10)],
			color: color == undefined ? '#999' : color,
			opacity: 1
		};
	});
}

function getUserInfoFromUsername(username){
	return redis.hget('ranking/id', username).then(id => {
		return getUserDetails(id)
	});
}

function getUserDetails(id) {
	return Promise.all([
		redis.hget('ranking/username', id),
		redis.hget('ranking/color', id), 
		redis.hget('ranking/logo', id)
	]).then(([username, color, logo]) => {
		return {username, color, logo, id};
	});
}


function datesList() {
	let promises = [];
	let annee = 2019;
	for(let mois = 12; mois > 0; mois--){
		if(mois < 10){
			mois = '0' + mois;
		}
		promises.push(dateIfExists(annee, mois));
	}
	return Promise.all(promises).then(values => {
		return values.filter(d => d !== null);
	});
}

function dateIfExists(annee, mois) {
	return redis.exists(`ranking/xp/${annee}/${mois}`).then(exists => {
		return exists ? `${mois}-${annee}` : null;
	});
}

const moisStr = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
const lvlcolors = ['777', 'd2d500', 'b3ee00', 'ff9600', 'ff0000', '00ffff', '009fff', '7a62d3', 'fc00ff', '7700a9', '00a938'];

app.listen(port, () => console.log(`Example app listening on port ${port}!`));


//XP avant de up
function xpLeft(xp0) {
    return (xp(level(xp0) + 1) - xp0)
}
//% d'XP du lvl en cours
function progress(xp0) {
    let lvl = level(xp0)
    let xplvl = xp(lvl)
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