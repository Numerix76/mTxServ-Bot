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
	admins: config.BOT_OWNER_ID,
	language: config.DEFAULT_LANG,
	logChannel: config.LOG_CHANNEL_ID,
	feeds: require("../feeds.json"),
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
	mode : "development" //isDev ? "development" : "production", // Change to production for production bot
});

client.login(config.BOT_TOKEN);
