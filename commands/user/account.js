const Discord = require('discord.js');
const mTxServUtil = require('../../util/mTxServUtil');
const mTxServApi = require('../../api/mTxServApi');

module.exports = {
	name: 'account',
	aliases: ['me'],
	category: 'User',
	description: 'Show my number of products',
	permissions: ['SEND_MESSAGES'],
	slash: 'both',

	callback: async ({ client, message, interaction, args }) => {
		const msg = message || interaction;

		const lang = require(`../../languages/${await mTxServUtil.resolveLangOfMessage(msg)}.json`);
		const author = msg.author || msg.user

		const api = new mTxServApi()

        const isAuthenticated = await api.isAuthenticated(author.id)
        if (!isAuthenticated) {
            return mTxServUtil.sayError(msg, lang['me']['not_logged'])
        }

        const embed = new Discord.MessageEmbed()
            .setColor('GREEN')
        ;

        let oauth

        try {
            oauth = await api.loginFromCredentials(msg.author.id)
        } catch(err) {
            console.error(err)
            return mTxServUtil.sayError(msg, lang['me']['cant_fetch'])
        }

        const me = await api.call(oauth['access_token'], 'user/me')
        const invoices = await api.call(oauth['access_token'], 'invoices')

        const countGameServers = invoices.filter(invoice => invoice.type_id === 1).length
        const countVoiceServers = invoices.filter(invoice => invoice.type_id === 2).length
        const countWebHosting = invoices.filter(invoice => invoice.type_id === 3).length
        const countVps = invoices.filter(invoice => invoice.type_id === 5).length

        embed.setDescription(lang['me']['logged'].replace('%name%', me.username))
        embed.setAuthor(`${msg.author.tag}`, `${msg.author.displayAvatarURL()}`)
        embed.addField('game servers'.toUpperCase(), `${countGameServers}`, true)
        embed.addField('voice servers'.toUpperCase(), `${countVoiceServers}`, true)
        embed.addField('web hosting'.toUpperCase(), `${countWebHosting}`, true)
        embed.addField('vps'.toUpperCase(), `${countVps}`, true)

        return embed
	}
};