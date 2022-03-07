const DiscordJS = require('discord.js')
const WOKCommands = require('wokcommands')
const Client = require('./client/client.js')
const path = require('path')
const fs = require('fs')
const dotenv = require('dotenv')
const { Intents } = DiscordJS

dotenv.config() // Initiate the process.env table

const client = global.client = new Client({
	intents: [
		Intents.FLAGS.GUILDS,
		Intents.FLAGS.GUILD_MESSAGES,
		Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
		//Intents.FLAGS.GUILD_MEMBERS,
		//Intents.FLAGS.GUILD_PRESENCES,
		Intents.FLAGS.DIRECT_MESSAGES
	],
	partials: ["CHANNEL"],
	mainGuilds: process.env.MAIN_GUILDS.split(','),
	feeds: require('./feeds.json'),
	inviteURL: process.env.BOT_INVITE_URL,
	statusURL: process.env.STATUS_URL
})

const isDev = global.isDev = process.argv.includes('-dev')

client.on('ready', () => {
	const clientWOK = global.clientWOK = new WOKCommands(client, {
		commandsDir: path.join(__dirname, 'commands'),
		showWarns: true,
		testServers: process.env.MAIN_GUILDS.split(','),
		botOwners: process.env.BOT_OWNER_ID.split(',')
	})
	.setDefaultPrefix(process.env.BOT_COMMAND_PREFIX)
	.setCategorySettings([
		{
			name: 'Admin',
			emoji: '👮',
			hidden: true
		},
		{
			name: 'Ark',
			emoji: '🦕'
		},
		{
			name: 'Configuration',
			emoji: '🚧',
			hidden: true
		},
		{
			name: 'Bot',
			emoji: '🤖',
		},
		{
			name: 'Documentation',
			emoji: '📃'
		},
		{
			name: 'Game server',
			emoji: '🎮'
		},
		{
			name: 'Minecraft',
			emoji: '⛏️'
		},
		{
			name: 'mTxServ',
			emoji: ':mtx:530431090117050398'
		},
		{
			name: 'News',
			emoji: '📰'
		},
		{
			name: 'Suggest',
			emoji: '💡'
		},
		{
			name: 'User',
			emoji: '🙎'
		},
		{
			name: 'Util',
			emoji: '👀'
		}
	])
})


fs.readdir('./events/', (err, files) => {
	if (err) return console.error(err);
	files.forEach((file) => {
		const eventFunction = require(`./events/${file}`);
		if (eventFunction.disabled) return;

		const event = eventFunction.event || file.split('.')[0];
		const emitter = (typeof eventFunction.emitter === 'string' ? client[eventFunction.emitter] : eventFunction.emitter) || client;
		const { once } = eventFunction;

		try {
			emitter[once ? 'once' : 'on'](event, (...args) => eventFunction.run(...args));
		} catch (error) {
			console.error(error.stack);
		}
	});
});

client.login(process.env.BOT_TOKEN)