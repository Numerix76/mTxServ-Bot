const Discord = require('discord.js');
const mTxServUtil = require('../../util/mTxServUtil');
const { Permissions } = Discord


module.exports = {
	name: 'remove-game',
	aliases: ['remove-role', 'retirer-jeu'],
	category: 'Admin',
	description: 'Remove a game from the discord.',
	testOnly: true,
	guildOnly: true,
	permissions: ['ADMINISTRATOR'],
	hidden: false,
	slash: 'both',

	expectedArgs: '<game>',
	expectedArgsTypes: ['STRING'],

	minArgs: 1,
	maxArgs: 1,	


	callback: async ({ client, message, interaction, args }) => {
		const msg = message ||interaction
		const lang = require(`../../languages/${await mTxServUtil.resolveLangOfMessage(msg)}.json`);

		const [game]  = args

		let games = await client.provider.get(msg.guild.id, 'games', [])

		games = games.filter((item) => {
			return item.name !== game
		})

		await client.provider.set(msg.guild.id, 'games', games)

		/*----------------------------------------------*/
		/* MAJ des roles dans les channels de sélection */
		/*----------------------------------------------*/
		const gamesChannel = await msg.guild.channels.cache.find(c => c.name === "select-role")
		
		let gamesMessage
		await gamesChannel.messages.fetch(gamesChannel.lastMessageId).then(message => gamesMessage = message).catch(console.error)
		
		if (gamesMessage)
		{
			const lang = require(`../../languages/en.json`);
			let row = gamesMessage.components?gamesMessage.components[0]:null

			if (!row) 
			{
				row = new Discord.MessageActionRow()
			}
			
			const options = []
				
			for(const game of games)
			{
				options.push({
					label: game.name,
					emoji: game.emoji,
					value: game.role
				})
			}

			let menu = row.components[0]

			if (games.length === 0)
			{
				gamesMessage.edit({
					components: []
				})
			}
			else
			{
				if (menu)
				{
					menu.setOptions(options)
					menu.setMaxValues(menu.options.length)
				}
				else
				{
					row.addComponents(
						new Discord.MessageSelectMenu()
						.setCustomId('games-roles')
						.setMinValues(0)
						.setMaxValues(1)
						.setPlaceholder(lang["select-games"]["select"])
						.setOptions(options)
					)
				}

				gamesMessage.edit({
					components: [row]
				})
			}
		}

		return mTxServUtil.saySuccess(msg, lang["remove-games"]["success"].replace("%game%", game))
	}
};