const Discord = require('discord.js');
const mTxServUtil = require('../../util/mTxServUtil');


module.exports = {
	name: 'feed-add',
    aliases: ['add-feed'],
	category: 'News',
	description: 'Subscribe to a feed.',
	permissions: ['ADMINISTRATOR'],
	slash: 'both',
	guildOnly: true,

	expectedArgs: "<game> <channel> <locale>",
	expectedArgsTypes: ['STRING', 'CHANNEL', 'STRING'],

	minArgs: 3,
	maxArgs: 3,

	options: [
		{
		  name: 'game',
		  description: 'Which game do you want to follow?',
		  required: true,
		  type: 'STRING',
		  choices: [
				{
					name: "Minecraft",
					value: "minecraft"
				},
			 	{
					name: "Ark",
					value: "ark"
				},
				{
					name: "Rust",
					value: "rust"
				},
				{
					name: "Garry's Mod",
					value: "gmod"
				},
				{
					name: "S&box",
					value: "sandbox"
				},
				{
					name: "Hytale",
					value: "hytale"
				},
				{
					name: "CS:GO",
					value: "csgo"
				},
				{
					name: "Valorant",
					value: "valorant"
				},
				{
					name: "League Of Legends",
					value: "lol"
				},
				{
					name: "Overwatch",
					value: "overwatch"
				},
				{
					name: "Fortnite",
					value: "fortnite"
				},
				{
					name: "Rocket League",
					value: "rocketleague"
				},
				{
					name: "Web",
					value: "web"
				},
				{
					name: "Film",
					value: "film"
				},
				{
					name: "Science",
					value: "science"
				},
		  ]
		},
		{
			name: 'channel',
			description: 'In which channel do you want to post new articles?',
			required: true,
			type: 'CHANNEL',
		},
		{
			name: 'locale',
			description: 'Which language?',
			required: true,
			type: 'STRING',
			choices: [
				{
					name: "French",
					value: "fr"
				},
			 	{
					name: "English",
					value: "en"
				},
				{
					name: "All",
					value: "all"
				},
			]
		},
	],

	callback: async ({ client, message, interaction, args }) => {
		const msg = message || interaction;
		const lang = require(`../../languages/${await mTxServUtil.resolveLangOfMessage(msg)}.json`);
		
		const games = ['minecraft', 'ark', 'rust', 'gmod', 'sandbox', 'hytale', 'csgo', 'valorant', 'lol', 'overwatch', 'fortnite', 'rocketleague', 'web', 'film', 'science']
		const channel = (message? message.mentions.channels.first() : interaction.options.getChannel("channel"))
		const locales = ['fr', 'en', 'all']
		
		const [game, , locale] = args

		if (games.indexOf(game) === -1) {
			return mTxServUtil.sayError(msg, lang["feed_add"]["invalid_game"])
		}

		if ( !channel || (channel.type !== "GUILD_TEXT" && channel.type !== "GUILD_NEWS") ) {
			return mTxServUtil.sayError(msg, lang["feed_add"]["invalid_channel"])
		}

		if (locales.indexOf(locale) === -1) {
			return mTxServUtil.sayError(msg, lang["feed_add"]["invalid_locale"])
		}

		await client.provider.rootRef
            .child(msg.guild.id)
            .child('feeds_suscribed')
            .child(game)
            .child(locale)
            .set(channel.id)

        return mTxServUtil.saySuccess(msg, lang["feed_add"]["success"].replace("%game%", game.toUpperCase()).replace("%locale%", locale === 'all' ? 'all languages' : locale.toUpperCase()).replace("%channel%", channel.name))
    }
};
