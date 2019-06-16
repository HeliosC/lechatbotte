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
    //console.log('connected');
});

app.get('/', function (req, res) {
  	affichage(res, 'global')
});

app.get('/:tagId', function (req, res) {
	let tag = req.params.tagId
	// if(tag!='RIP_Mikuia'){
	if(tag=='mensuel'){
  		affichage(res, dateXp())
  	}else if(tag=='global'){
  		affichage(res, 'global')
  	}else{
		tag=tag.substr(3,4)+'/'+tag.substr(0,2)
  		affichage(res, tag)
  	}
});

function dateExists(annee, mois, context){
	redis.exists(`ranking/xp/${annee}/${mois}`, function(err, exists){
	// console.losg(`ranking/xp/${annee}/${mois}`)
	// console.log(exists)
		if(exists){
			context.dates.push(`${mois}-${annee}`)
		}
	})
		
}	


function affichage(res, date){
	var context = {layout: false, lines:[], dates:[]}

	if(date=='global'){
		context['global']='global'
	}else if(date == dateXp()){
		context['mois']=moisStr[parseInt(date.substr(5,2))-1]
		context['annee']=date.substr(0,4)
		context['global']='en cours'
		context['ligneMois']=true
	}else{
		context['mois']=moisStr[parseInt(date.substr(5,2))-1]
		context['annee']=date.substr(0,4)
		context['ligneMois']=true
	}

	// context.dates.push('global')

	let annee = 2019
	for(mois=12; mois>0; mois--){
		if(mois<10){
			mois='0'+mois
		}
		dateExists(annee,mois,context)
	}

	// console.log(`ranking/xp/${date}`)

	redis.zrevrange(`ranking/xp/${date}`, 0, -1, 'WITHSCORES',function(err, scores){
		// console.log(scores)
		for (var i = 0; i < scores.length/2; i++) {
			// //console.log(i,scores.length/2-1)
			let max = scores.length/2
			//console.log("max0", i,max)
			let xp0=scores[2*i+1]
			//console.log(xp0)
			//console.log(scores[2*i])
			let id=scores[2*i]
			redis.hget('ranking/username', id, function(err,username){
				redis.hget('ranking/color', id, function(err,color){
					redis.hget('ranking/logo', id, function(err,logo){
						redis.zrevrank(`ranking/xp/${date}`, id, function(err,rank){
							//console.log(username,logo)
							//console.log("max", i,max)
							context.lines.push({
								rank: rank+1,
								username: username,
								avatar_url: logo,
								experience: xp0,
								level: level(parseInt(xp0)),
								progress: progress(parseInt(xp0)),
								lvlcolor : lvlcolors[Math.min(Math.floor(level(parseInt(xp0))/10),10)],
								color : color == undefined ? '#999' : color,
								// opacity : xp0%2 == 1 ? 0.3 : 1
								opacity : 1
							});
							if(rank+1==max){
								//console.log("ouais")
								// console.log(context.dates)
								res.render('classement', context);
							}
						})
					})
				})
			})
		}
	})
}

moisStr=['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre']
lvlcolors=['777','d2d500','b3ee00','ff9600','ff0000','00ffff','009fff','7a62d3','fc00ff','7700a9','00a938']

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