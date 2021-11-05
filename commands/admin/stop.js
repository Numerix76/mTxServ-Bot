const Discord = require('discord.js')
const mTxServUtil = require('../../util/mTxServUtil.js')

module.exports = {
	name: 'stop',
	aliases: ['bot-stop'],
	category: 'Admin',
	description: 'Stop the discord bot.',
	ownerOnly: true,
	permissions: ['SEND_MESSAGES'],
	hidden: false,
	slash: 'both',
	
	
	callback: async ({ client, message, interaction }) => {
		const msg = message || interaction;
		const lang = require(`../../languages/${await mTxServUtil.resolveLangOfMessage(msg)}.json`)

		const embed = new Discord.MessageEmbed()
			.setAuthor(`${client.user.tag}`, `${client.user.displayAvatarURL()}`)
			.setColor('RED')
			.setTitle(':red_circle: Bot is offline')
			.setTimestamp();

		mTxServUtil.sendLogMessage(embed)

		msg.reply({
			embeds: [mTxServUtil.sayError(msg, lang['bot_stop']['confirm'])]
		}).then(process.exit)
	}
}