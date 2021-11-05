const Discord = require('discord.js');
const mTxServUtil = require('../../util/mTxServUtil');
const ShareLogApi = require('../../api/ShareLogApi')

module.exports = {
	name: 'log',
	aliases: ['share-log', 'gist'],
	category: 'Game server',
	description: 'Share a log.',
	permissions: ['SEND_MESSAGES'],
	hidden: false,
	slash: 'both',

	expectedArgs: '<content>',
	expectedArgsTypes: ['STRING'],

	minArgs: 1,
	maxArgs: 1,


	callback: async ({ client, message, interaction, args }) => {
		const msg = message || interaction;
		const lang = require(`../../languages/${await mTxServUtil.resolveLangOfMessage(msg)}.json`);

		const [content] = args

		const api = new ShareLogApi()
		const result = await api.share(content)

		if (!result.success) {
			return mTxServUtil.sayError(msg, lang["share-log"]["failed"])
		}

		msg.delete()

		return mTxServUtil.saySuccess(msg, result.url)
	}
};