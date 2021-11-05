const Discord = require('discord.js');
const mTxServUtil = require('../../util/mTxServUtil');

module.exports = {
	name: 'clear-servers',
	aliases: ['server-clear', 'servers-clear'],
	category: 'Game server',
	description: 'Clear all game servers',
	guildOnly: true,
	permissions: ['ADMINISTRATOR'],
	hidden: false,
	slash: 'both',


	callback: async ({ client, message, interaction, args }) => {
		const msg = message || interaction
		const lang = require(`../../languages/${await mTxServUtil.resolveLangOfMessage(msg)}.json`)

		await client.provider.set(msg.guild.id, 'servers', [])

		return mTxServUtil.saySuccess(msg, lang["clear-servers"]["success"])
	}
};