const Discord = require('discord.js');
const mTxServUtil = require('../../util/mTxServUtil');


module.exports = {
	name: 'feed-remove',
    aliases: ['remove-feed', 'delete-feed', 'feed-delete'],
	category: 'mTxServ',
	description: 'Unsubscribe to a feed.',
	permissions: ['ADMINISTRATOR'],
	slash: 'both',
	guildOnly: true,

	expectedArgs: "<game>",
	expectedArgsTypes: ['STRING'],

	minArgs: 1,
	maxArgs: 1,

	options: [
		{
		  name: 'game',
		  description: 'Which game do you want to unfollow?',
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
	],

	callback: async ({ client, message, interaction, args }) => {
		const msg = message || interaction;
		const lang = require(`../../languages/${await mTxServUtil.resolveLangOfMessage(msg)}.json`);
		
		const games = ['minecraft', 'ark', 'rust', 'gmod', 'sandbox', 'hytale', 'csgo', 'valorant', 'lol', 'overwatch', 'fortnite', 'rocketleague', 'web', 'film', 'science']
		
		const [game] = args

		if (games.indexOf(game) === -1) {
			return mTxServUtil.sayError(msg, lang["feed_add"]["invalid_game"])
		}

		await client.provider.rootRef
            .child(msg.guild.id)
            .child('feeds_suscribed')
            .child(game)
            .remove()

        return mTxServUtil.saySuccess(msg, lang["feed_remove"]["success"].replace("%game%", game.toUpperCase()))
    }
};
