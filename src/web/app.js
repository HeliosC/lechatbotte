"use strict";

const express = require('express');
const exphbs  = require('express-handlebars');
const fs = require('fs');
const app = express();
const port = process.env.PORT || 5000;
const path = require('path')

app.use(express.static('public'));
app.engine('handlebars', exphbs({extendname: 'handlebars', defaultLayout: 'main', layoutsDir: __dirname + '/views/layouts/'}));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, '/views'));
app.use(express.static(path.join(__dirname, '/public')));

var redis = require('async-redis').createClient(process.env.REDIS_URL);
redis.on('connect', function () {
	console.log('redis connected');
});


app.get('/', function (req, res) {
	res.redirect("/mensuel/1")
});

app.get('/link', function (req, res) {
	redis.get('mortsLink').then(morts => {
		res.render('link', {morts, layout : 'void'})
	})
});

app.get('/ang', function (req, res) {
	res.render('angular', {layout : 'void'})
});

app.get('/chart', function (req, res) {
	res.render('chart')
})

app.get('/testmap', function (req, res) {
	res.render('map')
})

app.get('/commands', function (req, res) {
	var context = {commands:[], descriptedCommands:[]}
	datesList().then( dates => {
		context.dates = dates;

	redis.hgetall("commands").then(all =>{
		for(var cmd in all){
			console.log(cmd+"   "+all[cmd])
			context.commands.push({name: cmd, description: all[cmd]})
		}

		redis.hgetall("commands/description").then(descAll =>{
			for(var descCmd in descAll){
				context.descriptedCommands.push({name: descCmd, description: descAll[descCmd]})
			}
			getCounters()
			.then( counters => {
				context.counters = counters
				res.render('commands', context)
			})
		})
	})
	})
})

app.get('/:ranking/:page', function (req, res) {
	let ranking = req.params.ranking 
	datesList().then( dates => {
		if((["mensuel","global","user","chart"].concat(dates)).indexOf(ranking) == -1){
			res.redirect("/")
		}else if(ranking=='user'){
			let username = req.params.page.toLowerCase();
		var context = {}
		redis.hexists('ranking/id', username).then(exists =>{
			if(!exists){
				res.redirect('/');
				return;
			}
			Promise.all([
				getUserInfoFromUsername(username)
			]).then(([userInfo]) => {
				context.dates = dates;
				context.userInfo = userInfo;
				let datesPromises = dates.map((date) => {
					return getUserMontlyInfo(date, userInfo.id);
				});
				return Promise.all([context, ...datesPromises]);
			}).then(([context, ...montlyInfo]) => {
				context.dateInfo = montlyInfo;
				res.render('user', context);
			})
		})	
		}else{
		let rankingpage = ranking +'/'
		let page = parseInt( req.params.page )
		
		if(ranking=='mensuel'){
			affichage(res, dateXp(), page, rankingpage)
		}else if(ranking=='global'){
			affichage(res, 'global', page, rankingpage)
		}else{
			ranking=ranking.substr(3,4)+'/'+ranking.substr(0,2)
			affichage(res, ranking, page, rankingpage)
		}
		}
	})
})

app.get('/:tagId', function (req, res) {
	let tag = req.params.tagId
	if(tag != "ang"){
		res.redirect('/'+tag+'/1')
	}
});

function affichage(res, date, page, rankingpage){
	var context = {lines:[]}
	context.rankingpage = rankingpage;

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
		return getRankingList(date, dates, page, rankingpage)
	}).then(([dates, pages, ...rankingList]) => {
		return Promise.all([dates, pages, rankingList ])
	}).then(([dates, pages, lines]) => {
		context.dates = dates;
		context.lines = lines;
		context.pages = pages;
		res.render('classement', context);
	})
}

function getUserMedal(date, id){
	let dateUrl = date.toLowerCase()
	date = date.replace('-','/')
	let dateRedis = date == 'Global' ? 'global' : date.substr(3,4)+'/'+date.substr(0,2)
	return redis.zrevrank('ranking/xp/' + dateRedis, id).then(rank => {
		rank = parseInt(rank) + 1;
		if( rank > 0 && rank < 4){
			return({dateUrl, date, rank})
		}else{
			return;
		}
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
		let lvl, lvlColor, podium, rankint, top10, top10color;
		if (score == null) {
			lvl = '-';
			rank = '/';
			lvlColor = '0';
			podium = false;
		}else{
			lvl = level(parseInt(score));
			rankint  = rank + 1;
			rank = '#' + rankint;
			lvlColor = lvlcolors[Math.min(Math.floor(lvl / 10), 10)];
			podium = rankint < 4 && rankint >0;
			top10 = rankint < 11 && rankint >3;
			if(top10 && !podium){
				top10color= lvlcolors[14 - rankint];
				top10color= rankingColors[rankint - 4];
			}
		}
		return ({date, dateUrl, lvl, rank, rankint, lvlColor, podium, top10, top10color})
	})
}

function getRankingList(date, dates, page, rankingpage) {
	return redis.zrevrange(`ranking/xp/${date}`, 0, -1, 'WITHSCORES').then(scores => {
		var promises = [];
		let pages = [];
		for(let i=1; i<scores.length/200+1; i++){
			pages.push({num:i, active: page==i, rankingpage: rankingpage})
		}
		for (var rank = 100*(page-1); rank < Math.min(100*page, scores.length/2); rank++) {
				let max = scores.length / 2;
			let xpUser = scores[2*rank + 1];
			let id = scores[2*rank];
			promises.push(getRankingLine(date, id, xpUser, rank, dates));
		}
		return Promise.all([dates, pages, ...promises]);
	});
}

function getRankingLine(date, id, xpUser, rank, dates) {
	return getUserDetails(id).then(({username, color, logo}) => {

		let medalsPromises = dates.map((date) => {
			return getUserMedal(date, id);
		});
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
		return Promise.all([lineInfo, ...medalsPromises])
	}).then(([lineInfo, ...medalsInfo]) => {
		var medalsInfo = medalsInfo.filter(function (el) {
			return el != null;
		  });
		lineInfo.medalsInfo = medalsInfo;
		return(lineInfo)
	})
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

function getCounters() {
	return Promise.all([
		redis.get('morts'),
		redis.get('massacres'), 
		redis.get('lobbies')
	]).then(([morts, massacres, lobbies]) => {
		return {morts, massacres, lobbies};
	});
}

function datesList() {
	let promises = [];
	for(let annee = 2025;  annee > 2018; annee--){
		for(let mois = 12; mois > 0; mois--){
			if(mois < 10){
				mois = '0' + mois;
			}
			promises.push(dateIfExists(annee, mois));
		}
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

function dateRedis(date){
	return date.substr(3,4) + '/' + date.substr(0,2)
}

function dateDisplayed(date){
	return date.substr(5,2) + '-' + date.substr(0,4) 
}

const moisStr = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
const lvlcolors = ['777', 'd2d500', 'b3ee00', 'ff9600', 'ff0000', '00ffff', '009fff', '7a62d3', 'fc00ff', '7700a9', '00a938'];
const rankingColors = ['0000ff','0022ff','0044ff','0066ff','0088ff','00aaff','00ccff',]
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