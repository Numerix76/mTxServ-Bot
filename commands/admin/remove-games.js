const Discord = require('discord.js');
const mTxServUtil = require('../../util/mTxServUtil');
const { Permissions } = Discord


module.exports = {
	name: 'remove-game',
	aliases: ['remove-role', 'retirer-jeu'],
	category: 'Admin',
	description: 'Remove a game from the discord.',
	ownerOnly: true,
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
		const gamesChannelFR = await msg.guild.channels.cache.find(c => c.name === "selection-role")
		const gamesChannelEN = await msg.guild.channels.cache.find(c => c.name === "select-role")
		
		let gamesMessageFR
		await gamesChannelFR.messages.fetch(gamesChannelFR.lastMessageId).then(message => gamesMessageFR = message).catch(console.error)
		
		let gamesMessageEN
		await gamesChannelEN.messages.fetch(gamesChannelEN.lastMessageId).then(message => gamesMessageEN = message).catch(console.error)

		if (gamesMessageFR)
		{
			const lang = require(`../../languages/fr.json`);
			let rowFR = gamesMessageFR.components?gamesMessageFR.components[0]:null

			if (!rowFR) 
			{
				rowFR = new Discord.MessageActionRow()
			}

			const optionFR = []
				
			for(const game of games)
			{
				optionFR.push({
					label: game.name,
					emoji: game.emoji,
					value: game.roleFRID
				})
			}

			let menuFR = rowFR.components[0]

			if (games.length === 0)
			{
				gamesMessageFR.edit({
					components: []
				})
			}
			else
			{
				if (menuFR)
				{
					menuFR.setOptions(optionFR)
					menuFR.setMaxValues(menuFR.options.length)
				}
				else
				{
					rowFR.addComponents(
						new Discord.MessageSelectMenu()
						.setCustomId('games-roles')
						.setMinValues(0)
						.setMaxValues(1)
						.setPlaceholder(lang["select-games"]["select"])
						.setOptions(optionFR)
					)
				}

				gamesMessageFR.edit({
					components: [rowFR]
				})
			}	
		}
		
		
		if (gamesMessageEN)
		{
			const lang = require(`../../languages/en.json`);
			let rowEN = gamesMessageEN.components?gamesMessageEN.components[0]:null

			if (!rowEN) 
			{
				rowEN = new Discord.MessageActionRow()
			}
			
			const optionEN = []
				
			for(const game of games)
			{
				optionEN.push({
					label: game.name,
					emoji: game.emoji,
					value: game.roleENID
				})
			}

			let menuEN = rowEN.components[0]

			if (games.length === 0)
			{
				gamesMessageEN.edit({
					components: []
				})
			}
			else
			{
				if (menuEN)
				{
					menuEN.setOptions(optionEN)
					menuEN.setMaxValues(menuEN.options.length)
				}
				else
				{
					rowEN.addComponents(
						new Discord.MessageSelectMenu()
						.setCustomId('games-roles')
						.setMinValues(0)
						.setMaxValues(1)
						.setPlaceholder(lang["select-games"]["select"])
						.setOptions(optionEN)
					)
				}

				gamesMessageEN.edit({
					components: [rowEN]
				})
			}
		}

		return mTxServUtil.saySuccess(msg, lang["remove-games"]["success"].replace("%game%", game))
	}
};