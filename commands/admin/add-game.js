const Discord = require('discord.js');
const mTxServUtil = require('../../util/mTxServUtil');


module.exports = {
	name: 'add-game',
	aliases: [],
	category: 'Admin',
	description: 'Add a new role to the selector on the discord.',
	testOnly: true,
	guildOnly: true,
	permissions: ['ADMINISTRATOR'],
	hidden: false,
	slash: 'both',

	expectedArgs: '<game> <emoji> <role>',
	expectedArgsTypes: ['STRING', 'STRING', 'ROLE'],
    
    minArgs: 3,
    maxArgs: 3,
	

	callback: async ({ client, message, interaction, args }) => {
		const msg = message ||interaction
		const lang = require(`../../languages/${await mTxServUtil.resolveLangOfMessage(msg)}.json`);

		const [game, emoji] = args
		const role = (message?message.mentions.roles.first().id : interaction.options.getRole("role").id)

		const games = await client.provider.get(msg.guild.id, 'games', [])

		for(const game of games)
			if (game.role === role)
				return mTxServUtil.sayError(msg, lang["add-games"]["role_exist"]);

		/*------------------------------------------------*/
		/* Ajout des roles dans les channels de sélection */
		/*------------------------------------------------*/
		let gamesMessage
		const currentConfig = await client.provider.get(msg.guild.id, 'select-games', {})
		const gamesChannel = await msg.guild.channels.cache.get(currentConfig.channel)
		await gamesChannel?.messages.fetch(currentConfig.message).then(message => gamesMessage = message).catch(console.error)

		if ( !gamesMessage ) {
            return mTxServUtil.sayError(msg, `The select-games channel or message doesn't exist. Use \`m!select-games\` in a channel to configure it.`)
		}
		

		let row = gamesMessage.components?gamesMessage.components[0]:null
		if (!row)
			row = new Discord.MessageActionRow()
		
		const optionEN = [
			{
				label: game,
				emoji: emoji,
				value: role
			}
		]

		
		let menu = row.components[0]

		if (menu)
		{
			menu.addOptions(optionEN)
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
				.addOptions(optionEN)
			)
		}

		gamesMessage.edit({
			components: [row]
		})

		games.push({
			name: game,
			emoji: emoji,
			role: role
		})

		await client.provider.set(msg.guild.id, 'games', games)

		return mTxServUtil.saySuccess(msg, lang["add-games"]["success"].replace("%game%", game).replace("%emoji%", emoji))
	},

};