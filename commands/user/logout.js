const Discord = require('discord.js');
const mTxServUtil = require('../../util/mTxServUtil');
const mTxServApi = require('../../api/mTxServApi');

module.exports = {
	name: 'logout',
	aliases: ['exit'],
	category: 'User',
	description: 'Remove link of your discord account with your mTxServ account',
	permissions: ['SEND_MESSAGES'],
	slash: 'both',

	callback: async ({ client, message, interaction, args }) => {
		const msg = message || interaction;

		const lang = require(`../../languages/${await mTxServUtil.resolveLangOfMessage(msg)}.json`);
		const author = msg.author || msg.user

        const api = new mTxServApi()
        const isAuthenticated = await api.isAuthenticated(author.id)

        if (!isAuthenticated) {
            return mTxServUtil.sayError(msg, lang['logout']['not_logged'])
        }

        await api.logout(author.id)

        return mTxServUtil.saySuccess(msg, lang['logout']['success'])
	}
};