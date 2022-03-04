const Discord = require('discord.js');
const mTxServUtil = require('../../util/mTxServUtil');
const { Permissions } = Discord


module.exports = {
	name: 'add-role',
	aliases: [],
	category: 'Admin',
	description: 'Add a new role to the selector on the discord.',
	ownerOnly: true,
	guildOnly: true,
	permissions: ['ADMINISTRATOR'],
	hidden: false,
	slash: 'both',

	expectedArgs: '<game> <emoji> <roleFR> <roleEN>',
	expectedArgsTypes: ['STRING', 'STRING', 'ROLE', 'ROLE'],
    
    minArgs: 4,
    maxArgs: 4,
	

	callback: async ({ client, message, interaction, args }) => {
		const msg = message ||interaction
		const lang = require(`../../languages/${await mTxServUtil.resolveLangOfMessage(msg)}.json`);

		const [game, emoji, roleFR, roleEN] = args

		const games = await client.provider.get(msg.guild.id, 'games', [])

		for(const game of games)
			if (game.roleENID === roleEN || game.roleFRID === roleFR)
				return mTxServUtil.sayError(msg, lang["add-games"]["role_exist"]);

		/*------------------------------------------------*/
		/* Ajout des roles dans les channels de sélection */
		/*------------------------------------------------*/
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

			const optionFR = [
				{
					label: game,
					emoji: emoji,
					value: roleFR
				}
			]

			let menuFR = rowFR.components[0]

			if (menuFR)
			{
				menuFR.addOptions(optionFR)
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
					.addOptions(optionFR)
				)
			}

			gamesMessageFR.edit({
				components: [rowFR]
			})
		}
		
		
		if (gamesMessageEN)
		{
			const lang = require(`../../languages/en.json`);
			let rowEN = gamesMessageEN.components?gamesMessageEN.components[0]:null
	
			if (!rowEN) 
			{
				rowEN = new Discord.MessageActionRow()
			}
			
			const optionEN = [
				{
					label: game,
					emoji: emoji,
					value: roleEN
				}
			]
	
			
			let menuEN = rowEN.components[0]
	
			if (menuEN)
			{
				menuEN.addOptions(optionEN)
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
					.addOptions(optionEN)
				)
			}

			gamesMessageEN.edit({
				components: [rowEN]
			})
		}

		games.push({
			name: game,
			emoji: emoji,
			others: false,
			roleFRID: roleFR,
			roleENID: roleEN
		})

		await client.provider.set(msg.guild.id, 'games', games)

		return mTxServUtil.saySuccess(msg, lang["add-games"]["success"].replace("%game%", game).replace("%emoji%", emoji))
	},

	// init: async (client, instance) => {
	// 	//console.log( await instance.slashCommands.get().filter(function(a) {return a.name === module.exports.name}))

	// 	const commands = await instance.slashCommands.get()
	// 	let commande;
	// 	for(const command of commands)
	// 		if (command[1].name === module.exports.name)
	// 			commande = command[1];

	// 	const permissions = [
	// 		{
	// 			id: '311931325240180736',
	// 			type: 'USER',
	// 			permission: false,
	// 		},
	// 	];
		
	// 	await commande.permissions.add({guild:"894204482580279306", permissions });	
	// }

};