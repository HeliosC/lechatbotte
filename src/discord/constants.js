prod = {
	user: {
		poui: "255069392780394506",
		solis: "177440457805004800",
		helios: "243477125653463040"
	},
	commandPrefix: "²",

	chatdesbois: {
		server: "216522270682775552",
		channels: {
			reglement: "299124426866294787",
			main: "216522270682775552",			
			role: "470651150803140654",
		},
		messages: {
			role: "710202967776821348"
		},
		roles: {
			subscriber: "343161936365486100",
			moderator: "266987117920387073",
			administrator: "282185570757771264",
		},
	},

	helios: {
		server: "350708761226117122",
		channels: {
			games: "455138913422409729",
			quiz: "615009620574076961",
			password: "455138913422409729",
			test: "555507117369458723",
			jdr: "729330568340439051",
			mute: "548283395906600970"
		},
	
		roles: {
			fafa: "521296372524384258",
			subscriber: "651186293384020029",
			moderator: "350710017110048769",
			administrator: "350717914133037057",
		},
	}
};

test = {
	user: {
		poui: "243477125653463040",
		solis: "177440457805004800",
		helios: "243477125653463040"
	},
	commandPrefix: "²",

	helios: {		
		server: "1293978473249112137",
		channels: {
			games: "1293979449074778265",
			quiz: "1293979449074778265",
			password: "1293979449074778265",
			//test: "1293979449074778265",
			//jdr: "1293979449074778265",
			//mute: "1293979449074778265"
		},
	
		roles: {
			fafa: "521296372524384258",
			subscriber: "651186293384020029",
			moderator: "350710017110048769",
			administrator: "350717914133037057",
		},
	},

	chatdesbois: {
		server: "1293978473249112137",
		channels: {
			reglement: "1293979449074778265",
			main: "1293979449074778265",			
			role: "1293979449074778265"
		},
		messages: {},
		roles: {},
	},
};

let constants
if(process.env.ENV == 'prod') 
	constants = prod 
else 
	constants = test

module.exports = constants

oldConstants = {
	botName: "Le Chat Botté",
	channels: {
		images: "🤡│images-vidéos-médias",
		chanCh: "💬│cest-ta-vie",
		queue: "chat-le_d_attente",
		games: "jeux",
		quiz: "quiz",
		role: "rôle",
		password: "mot_de_passe",
		test: "test",
		jdr: "jdr"
	},
	rolesName: {
		donnator: "Chats de qualité supérieure 🐱 (donateurs)",
		subscriber: "PUTAIN DE CHATONS 💕 (subs)",
		moderator: "Chats sous chef 🐾",
		administrator: "Le Chat en chef 🦄",

		poulpita: "MADAME POULPITA 💜",
		modPoulpes: "ROIS & REINES DES POULPES 👑"

	},
	commandPrefix: "²"
};
