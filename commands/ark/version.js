const Discord = require('discord.js');
const mTxServUtil = require('../../util/mTxServUtil');
const ARKApi = require('../../api/ARKApi')


module.exports = {
	name: 'ark-version',
	aliases: ['ark-latest', 'ark-v'],
	category: 'Ark',
	description: 'Show the latest version of ARK.',
	permissions: ['SEND_MESSAGES'],
	slash: 'both',

	callback: async ({ client, message, interaction, args }) => {
		const msg = message || interaction;
		const lang = require(`../../languages/${await mTxServUtil.resolveLangOfMessage(msg)}.json`)

        const api = new ARKApi()
        const latestVersion = await api.latestVersion()

        mTxServUtil.saySuccess(msg, lang['ark_version']['message'].replace('%version%', latestVersion))
	},
};
