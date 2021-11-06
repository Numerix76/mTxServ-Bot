const Discord = require('discord.js');
const mTxServUtil = require('../../util/mTxServUtil');

module.exports = {
	name: 'explain',
    aliases: ['explique'],
	category: 'mTxServ',
	description: 'Display explain message.',
	permissions: ['SEND_MESSAGES'],
	slash: 'both',

	callback: async ({ client, message, interaction, args }) => {
		const msg = message || interaction;
		const lang = require(`../../languages/${await mTxServUtil.resolveLangOfMessage(msg)}.json`);
		
		const embed = new Discord.MessageEmbed()
            .setTitle(lang['explain']['title'])
            .setDescription(`${lang['explain']['description']}\n\n${lang['explain']['rule_1']}\n${lang['explain']['rule_2']}\n${lang['explain']['rule_3']}\n${lang['explain']['rule_4']}\n${lang['explain']['rule_5']}\n${lang['explain']['rule_6']}`)
            .setColor('BLUE')
        ;

        return embed
	},
};
