const Discord = require('discord.js');
const mTxServUtil = require('../../util/mTxServUtil');
const GameServerApi = require('../../api/GameServerApi')
const mTxServApi = require('../../api/mTxServApi')

module.exports = {
	name: 'add-server',
	aliases: ['server-add', 'serveur-add', 'add-serveur'],
	category: 'Game server',
	description: 'Add a game server.',
	permissions: ['ADMINISTRATOR'],
	slash: false,

	callback: async ({ client, message, interaction, args }) => {
		const msg = message || interaction;
		const lang = require(`../../languages/${await mTxServUtil.resolveLangOfMessage(msg)}.json`);

		if ( msg.channel.type === 'DM' )
			return

		const api = new mTxServApi()
		const isAuthenticated = await api.isAuthenticated(msg.author.id)
		if (!isAuthenticated) {
			mTxServUtil.sayError(msg, lang['server_add']['not_logged'])
			return
		}

		let oauth

		try {
			oauth = await api.loginFromCredentials(msg.author.id)
		} catch(err) {
			console.error(err)
			mTxServUtil.sayError(msg, lang['me']['cant_fetch'])
			return
		}

		await mTxServUtil.sayWarning(msg, lang['server_add']['fetch'])

		const invoices = await api.call(oauth['access_token'], 'invoices')

		if (!invoices.length) {
			mTxServUtil.sayError(msg, lang['server_add']['no_result'])
			return
		}

		const gsApi = new GameServerApi()

		let embed = new Discord.MessageEmbed()
			.setColor('BLUE')
			.setTimestamp()

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

		const infosServ = list.map((item, key) => `**${++key}.** ❯ __${item.status.params.used_slots||0}/${item.status.params.max_slots||0}__ ❯ **${item.invoice.address.toUpperCase()}**\n\`\`\`\n${item.status.params.host_name||item.invoice.cache_hostname||item.invoice.name||'n-a'}\`\`\``).join('\n')

		embed.setDescription(infosServ)

		await msg.reply({
			embeds: [embed]
		})


		mTxServUtil.ask(msg, lang['server_add']['which']);

		const filter = m => m.author.id === msg.author.id
		const collector = msg.channel.createMessageCollector({
			filter,
			max: 1,
			time: 40_000, 
			errors: ['time'] })
		
		collector.on('collect', async message => { 
			const serverKey = message.content-1

			if (typeof invoices[serverKey] === 'undefined') {
				mTxServUtil.sayError(msg, lang['server_add']['not_found'])
				return
			}

			mTxServUtil.saySuccess(msg, lang['server_add']['added'])

			let gameServers = await client.provider.get(msg.guild.id, 'servers', [])        
			gameServers = gameServers.filter(gs => gs.address !== list[serverKey].invoice.address)
			
			gameServers.push({
				game: list[serverKey].invoice.game,
				address: list[serverKey].invoice.address,
				isHostedOnMtxServ: true,
				creatorId: msg.author.id
			})

			await client.provider.set(msg.guild.id, 'servers', gameServers)

			embed = await gsApi.generateEmbed(msg, list[serverKey].invoice.game, list[serverKey].invoice.address, await mTxServUtil.resolveLangOfMessage(msg))
			msg.reply({
				embeds: [embed]
			})
		})

		collector.on('end', collected => {
			if (collected.size === 0)
				mTxServUtil.sayError(msg, lang['login']['cancelled'])
		})
	},
};
