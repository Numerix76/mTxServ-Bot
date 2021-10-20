const Discord = require('discord.js');
const mTxServUtil = require('../../util/mTxServUtil');
const { formatNumber } = require('../../util/Util');


module.exports = {
	name: 'stats',
	aliases: ['bot-stats'],
	category: 'Bot',
	description: 'Display bot stats.',
	permissions: ['SEND_MESSAGES'],
	slash: 'both',

	callback: async ({ client, message, interaction, args }) => {
		const msg = message || interaction;
		const lang = require(`../../languages/${await mTxServUtil.resolveLangOfMessage(msg)}.json`)
		
		mTxServUtil.sayMessage(msg, lang['stats']['servers'].replace('%count%', formatNumber(client.guilds.cache.size)))
	},
};
