const { mTxServClient } = require("./client.js");
const config = require("../config.json");
const { IntentsBitField } = require("discord.js");

global.isDev = process.argv.includes('-dev')

const client = global.client = new mTxServClient({
	intents: [
		IntentsBitField.Flags.Guilds, 
		IntentsBitField.Flags.GuildMessages,
		IntentsBitField.Flags.DirectMessages,
		IntentsBitField.Flags.DirectMessageReactions
	],
	defaultLanguage: config.DEFAULT_LANG,
	guildInvite: config.GUILD_INVITE_URL,
	botInvite: config.BOT_INVITE_URL,
	sourceURL: config.SOURCE_URL,
	admins: config.BOT_OWNER_ID,
	logChannel: config.LOG_CHANNEL_ID,
	feeds: require("../feeds.json"),
	mainGuilds: config.MAIN_GUILDS,
	statusURL: config.STATUS_URL,
	managers: {
		commands: {
			directory: "./commands",
			prefix: config.BOT_COMMAND_PREFIX,
			autoRegisterApplicationCommands: true,
			applicationPermissions: true,
			default: {
					adminOnly: false,
					category: 'Default category',
					channel: 'GUILD',
					clientPermissions: ["SendMessages"],
					cooldown: 3.5,
					examples: ['Example 1', 'Example 2'],
					type: 'SLASH_COMMAND',
					usage: config.BOT_COMMAND_PREFIX + 'command',
					userPermissions: ["SendMessages"],
			},
		},
		events: {
			directory: "./events",
		},
		buttons: {
			directory: "./interactions/buttons",
		},
		selectMenus: {
			directory: "./interactions/selectmenus",
		},
		modals: {
			directory: './interactions/modals',
		},
		inhibitors: {
			directory: "./inhibitors",
		},
	},
	mode : isDev ? "development" : "production",
});

client.login(config.BOT_TOKEN);
