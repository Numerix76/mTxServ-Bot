const Discord = require('discord.js');
const mTxServUtil = require('../../util/mTxServUtil');

module.exports = {
	name: 'workshop-dl',
    aliases: ['steam-dl'],
	category: 'Game server',
	description: 'Get a link to download a STEAM Workshop addon.',
	permissions: ['SEND_MESSAGES'],
	hidden: false,
	slash: 'both',

	expectedArgs: '<url>',
	expectedArgsTypes: ['STRING'],

	minArgs: 1,
	maxArgs: 1,

	callback: async ({ client, message, interaction, args }) => {
		const msg = message || interaction
		const lang = require(`../../languages/${await mTxServUtil.resolveLangOfMessage(msg)}.json`);

		const [url] = args

		const pattern = new RegExp("https:\\/\\/steamcommunity.com\\/sharedfiles\\/filedetails\\/\\?id=([0-9]{2,15})(&.+)?");
		const matches = pattern[Symbol.match](url);

		if (!matches[1]) {
			return mTxServUtil.sayError(msg, lang["workshop-dl"]["invalid-url"])
		}

		const addonId = matches[1]

		const downloadLink = `https://steamworkshopdownloader.io/download/${addonId}`
		
		return mTxServUtil.saySuccess(msg, lang["workshop-dl"]["success"].replace("%downloadLink%", downloadLink))
	}
};