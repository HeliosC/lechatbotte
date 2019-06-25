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
			dates = ['Global'].concat(dates);
			let datesPromises = dates.map((date) => {
				return getUserMontlyInfo(date, userInfo.id);
			});
			return Promise.all([context, ...datesPromises]);
		}).then(([context, ...montlyInfo]) => {
			console.log(montlyInfo);
			context.dateInfo = montlyInfo;
			res.render('user', context);
		}).catch(next);
	})
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
	
	datesList().then(dates => {
		dates = ['Global'].concat(dates)
		// console.log("lolololol", getRankingList(date, dates))
		// console.log('date', date)
		var rankingList = getRankingList(date, dates)
		// getRankingList(date, dates).then( rankingList=> {
			console.log(rankingList)
		return ([dates, rankingList ])
		// })
	}).then(([dates, lines]) => {
		context.dates = dates;
		context.lines = lines;
		// console.log(context)
		res.render('classement', context);
		// let medalsPromises = dates.map((date) => {
		// 	return getUserMedal(date, id);
		// });
		// return Promise.all([context, ...medalsPromises]);
	})

	// Promise.all([
	// 	datesList(),
	// 	getRankingList(date),
	// 	// redis.hexists('ranking/id', username)
	// ]).then(([dates, lines]) => {
	// 	context.dates = dates;
	// 	context.lines = lines;
	// 	res.render('classement', context);
	
		// let medalsPromises = dates.map((date) => {
		// 	return getUserMedal(date, id);
		// });
		// return Promise.all([context, ...medalsPromises]);

	// })

	// .then(([context, ...medalsInfo]) => {
	// 	context.medalsInfo = medalsInfo
	// 	console.log(medalsInfo)
		// res.render('classement', context);

	// })
}

function getUserMedal(date, id){
	let dateUrl = date.toLowerCase()
	date = date.replace('-','/')
	let dateRedis = date == 'Global' ? 'global' : date.substr(3,4)+'/'+date.substr(0,2)
	return redis.zrevrank('ranking/xp/' + dateRedis, id).then(rank => {
		// console.log("raaaaaank", rank, date, id)
		return({dateUrl, date, rank})
	})

}

function getUserMontlyInfo(date, id){
	let dateUrl = date.toLowerCase()
	date = date.replace('-','/')
	let dateRedis = date == 'Global' ? 'global' : date.substr(3,4)+'/'+date.substr(0,2)
	return Promise.all([
		redis.zscore('ranking/xp/'+dateRedis, id),
		redis.zrevrank('ranking/xp/'+dateRedis, id)
	]).then(([score, rank]) => {
		// console.log(score)
		let lvl, lvlColor, podium, rankint;
		if (score == null) {
			lvl = '-';
			rank = '/';
			lvlColor = '0';
			podium = false;
		}else{
			lvl = level(parseInt(score));
			rankint  = rank + 1;
			rank = '#' + rankint;
			lvlColor = lvlcolors[lvl];
			podium = rankint < 4 && rankint >0;
		}
		return ({date, dateUrl, lvl, rank, rankint, lvlColor, podium})
	})
}

function getRankingList(date, dates) {
	return redis.zrevrange(`ranking/xp/${date}`, 0, -1, 'WITHSCORES').then(scores => {
		var promises = [];
		for (var rank = 0; rank < scores.length / 2; rank++) {
			let max = scores.length / 2;
			let xpUser = scores[2*rank + 1];
			let id = scores[2*rank];
			promises.push(getRankingLine(date, id, xpUser, rank, dates));
		}
		return Promise.all(promises);
	});
}

function getRankingLine(date, id, xpUser, rank, dates) {
	return getUserDetails(id).then(({username, color, logo}) => {

		let medalsPromises = dates.map((date) => {
			// console.log(getUserMedal(date, id))
			return getUserMedal(date, id);
		});
		// console.log(medalsPromises)
		var lineInfo = {
			id: id,
			rank: rank + 1,
			username: username,
			avatar_url: logo,
			experience: xpUser,
			level: level(parseInt(xpUser)),
			progress: progress(parseInt(xpUser)),
			lvlcolor: lvlcolors[Math.min(Math.floor(level(parseInt(xpUser)) / 10), 10)],
			color: color == undefined ? '#999' : color,
			opacity: 1
		}
		// return ([lineInfo, medalsPromises]);
		return Promise.all([lineInfo, ...medalsPromises]);
	}).then(([lineInfo, ...medalsInfo]) => {
		// console.log(medalsInfo)
		lineInfo.medalsInfo = medalsInfo;
		// console.log(lineInfo)
		// return Promise.all(lineInfo)
		return(lineInfo)
		// return Promise.all(lineInfo)
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