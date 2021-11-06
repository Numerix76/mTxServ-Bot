const Discord = require('discord.js');
const mTxServUtil = require('../../util/mTxServUtil');

module.exports = {
	name: 'support',
    aliases: ['supports', 'ticket', 'tickets', 's'],
	category: 'mTxServ',
	description: 'Get support informations.',
	permissions: ['SEND_MESSAGES'],
	slash: 'both',

	callback: async ({ client, message, interaction, args }) => {
		const msg = message || interaction;
		const userLang = await mTxServUtil.resolveLangOfMessage(msg)
		const lang = require(`../../languages/${userLang}.json`);
		
		const embed = new Discord.MessageEmbed()
            .setTitle(lang['support']['title'])
            .setDescription(lang['support']['description'])
            .setColor('BLUE')
            .addField(lang['support']['before'], userLang === 'fr' ? 'https://mtxserv.com/fr/help' : 'https://mtxserv.com/help')
            .addField(lang['support']['support'], userLang === 'fr' ? 'https://mtxserv.com/fr/support/list' : 'https://mtxserv.com/support/list', true)
            .addField(lang['support']['create'], userLang === 'fr' ? 'https://mtxserv.com/fr/support/new' : 'https://mtxserv.com/support/new', true)
            .addField(lang['support']['report'], ':star:')
        ;

        return embed
	},
};
