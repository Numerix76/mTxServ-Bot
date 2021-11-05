const Discord = require('discord.js');
const mTxServUtil = require('../../util/mTxServUtil');
const GameServerApi = require('../../api/GameServerApi')
const mTxServApi = require('../../api/mTxServApi')

module.exports = {
	name: 'add-server',
	aliases: ['server-add', 'serveur-add', 'add-serveur'],
	category: 'Game server',
	guildOnly: true,
	description: 'Add a game server.',
	permissions: ['ADMINISTRATOR'],
	slash: 'both',

	callback: async ({ client, message, interaction, args }) => {
		const msg = message || interaction;
		const author = msg.author?msg.author.id:msg.user.id
		const lang = require(`../../languages/${await mTxServUtil.resolveLangOfMessage(msg)}.json`);

		const api = new mTxServApi()
		const isAuthenticated = await api.isAuthenticated(author)
		if (!isAuthenticated) {
			return mTxServUtil.sayError(msg, lang['server_add']['not_logged'])
		}

		let oauth

		try {
			oauth = await api.loginFromCredentials(author)
		} catch(err) {
			console.error(err)
			return mTxServUtil.sayError(msg, lang['me']['cant_fetch'])
		}

		const replyMsg = await msg.reply({
			embeds: [mTxServUtil.sayWarning(msg, lang['server_add']['fetch'])],
		})

		const invoices = await api.call(oauth['access_token'], 'invoices')

		if (!invoices.length) {
			return mTxServUtil.sayError(msg, lang['server_add']['no_result'])
		}

		const gsApi = new GameServerApi()

		const list = []

		for (const invoice of invoices) {
			if (invoice.type_id !== 1) {
				continue;
			}

			const status = await gsApi.status(invoice.game, invoice.host, invoice.port)
			list.push({
				invoice: invoice,
				status: status
			})
		}

		const embed = new Discord.MessageEmbed()
			.setColor('BLUE')
			.setTimestamp()
			.setTitle(lang['server_add']['title_select'])
			.setDescription(lang['server_add']['description_select'])

		let row = new Discord.MessageActionRow()
		
		const option = []
		for (const server of list) {
			option.push({
				label: server.status.params.host_name||server.invoice.cache_hostname||server.invoice.name||'n-a',
				description: `${server.invoice.address.toUpperCase()} - ${server.status.params.used_slots||0}/${server.status.params.max_slots||0}`,
				value: option.length.toString(),
				emoji: server.status.is_online?'🟢':'🔴'
			})
		}

		row.addComponents( 
			new Discord.MessageSelectMenu()
				.setCustomId('servers')
				.setMinValues(0)
				.setMaxValues(option.length)
				.setPlaceholder(lang['server_add']['select'])
				.addOptions(option)
		)

		mTxServUtil.editResponse(replyMsg, interaction, {embeds: [embed], components: [row]})

		const filter = (componentInt) => { return componentInt.user.id === author }

		const collector = msg.channel.createMessageComponentCollector({
			filter,
			max: 1,
			time: 40_000,
			errors: ['time']
		})

		collector.on('collect', async (i) => {
			for (const id of i.values)
			{
				const serverKey = parseInt(id)

				if (typeof list[serverKey] === 'undefined') {
					continue
				}

				let gameServers = await client.provider.get(msg.guild.id, 'servers', [])        
				gameServers = gameServers.filter(gs => gs.address !== list[serverKey].invoice.address)
				
				gameServers.push({
					game: list[serverKey].invoice.game,
					address: list[serverKey].invoice.address,
					isHostedOnMtxServ: true,
					creatorId: author
				})

				await client.provider.set(msg.guild.id, 'servers', gameServers)
			}

			i.reply({
				embeds: [mTxServUtil.saySuccess(msg, lang['server_add']['added'])],
			})
		})

		collector.on('end', collected => {
			mTxServUtil.editResponse(replyMsg, interaction, {
				content: lang['server_add']['interaction_end'], 
				embeds: [],
				components: []
			})
		})
	},
};
