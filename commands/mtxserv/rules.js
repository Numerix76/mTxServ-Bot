const Discord = require('discord.js');
const mTxServUtil = require('../../util/mTxServUtil');

module.exports = {
	name: 'rules',
    aliases: ['regle', 'regles', 'reglement', 'rule'],
	category: 'mTxServ',
	description: 'Get rules of this Discord.',
	permissions: ['ADMINISTRATOR'],
	slash: false,
	guildOnly: true,
	testOnly: true,

	callback: async ({ client, message, interaction, args }) => {
		const msg = message || interaction;
		const lang = require(`../../languages/${await mTxServUtil.resolveLangOfMessage(msg)}.json`);
		
		const embed = new Discord.MessageEmbed()
            .setTitle(lang['rules']['title'])
            .setColor('BLUE')
            .setDescription(lang['rules']['description'])
        ;

        msg.channel.send({
			embeds: [embed]
		})
	},
};
