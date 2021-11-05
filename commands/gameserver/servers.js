const GameServerApi = require('../../api/GameServerApi')
const Discord = require('discord.js')
const paginationEmbed = require('../../util/pagination');
const mTxServUtil = require('../../util/mTxServUtil');

module.exports = {
	name: 'servers',
	aliases: ['serveurs', 'serverlist'],
	category: 'Game server',
	description: 'Show game servers.',
	guildOnly: true,
	permissions: ['SEND_MESSAGES'],
	hidden: false,
	slash: 'both',


	callback: async ({ client, message, interaction, args }) => {
		const msg = message || interaction
		const userLang = await mTxServUtil.resolveLangOfMessage(msg)
		const lang = require(`../../languages/${userLang}.json`)

		let gameServers = await client.provider.get(msg.guild.id, 'servers', [])

		if (!gameServers.length) {
			const embed = new Discord.MessageEmbed()
				.setTitle(lang['servers']['no_result'])
				.setDescription(lang['servers']['no_result_more'])
				.setColor('ORANGE')
			;

			return embed
		}

		const api = new GameServerApi()

		const pages = []
		for (const gameServer of gameServers) {
			const embed = await api.generateEmbed(msg, gameServer.game, gameServer.address, userLang);
			embed.setFooter(lang['servers']['how_to'])
			pages.push(embed)
		}

		if (pages.length === 1) {
			const embed = pages[0]
			return embed
		}

		paginationEmbed(msg, interaction, pages);
	}
};