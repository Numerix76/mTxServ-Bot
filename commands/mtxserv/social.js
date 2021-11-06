const Discord = require('discord.js');
const mTxServUtil = require('../../util/mTxServUtil');

module.exports = {
	name: 'social',
    aliases: ['socials', 'twitter', 'facebook', 'github', 'youtube'],
	category: 'mTxServ',
	description: 'Show social links.',
	permissions: ['SEND_MESSAGES'],
	slash: 'both',

	callback: async ({ client, message, interaction, args }) => {
		const msg = message || interaction;
		const userLang = await mTxServUtil.resolveLangOfMessage(msg)
		const lang = require(`../../languages/${userLang}.json`);
		
		const links = [
            {
                platform: ':flag_fr: Twitter',
                link: 'https://twitter.com/mTxServ',
                locale: ['fr'],
            },
            {
                platform: ':flag_us: Twitter',
                link: 'https://twitter.com/mTxServ_EN',
                locale: ['en'],
            },
            {
                platform: ':flag_us: GitHub',
                link: 'https://github.com/mTxServ',
                locale: ['fr', 'en'],
            },
            {
                platform: ':flag_fr: Forums d\'entraide',
                link: 'https://aide-serveur.fr/',
                locale: ['fr'],
            },
            {
                platform: ':flag_fr: Facebook',
                link: 'https://www.facebook.com/mtxserv',
                locale: ['fr'],
            },
            {
                platform: ':flag_fr: Youtube',
                link: 'https://www.youtube.com/mtxserv',
                locale: ['fr'],
            },
        ]

        const embed = new Discord.MessageEmbed()
            .setTitle(lang['social_links']['title'])
            .setColor('BLUE')
        ;

        for (const k in links) {
            if (-1 === links[k]['locale'].indexOf(userLang)) {
                continue;
            }

            embed.addField(links[k].platform, `${links[k].link}`)
        }

        return embed
	},
};
