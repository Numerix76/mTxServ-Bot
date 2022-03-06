const Discord = require('discord.js');
const mTxServUtil = require('../../util/mTxServUtil.js')

module.exports = {
	name: 'create-status',
	aliases: [],
	category: 'Admin',
	description: 'Create the status message',
	testOnly: true,
	guildOnly: true,
	permissions: ['ADMINISTRATOR'],
	hidden: false,
	slash: false,

	callback: async ({ client, message, interaction, args }) => {
		const msg = message || interaction
		
		const statusMsg = await msg.channel.send({
			content: "Waiting a refresh"
		})

		client.provider.set('status', msg.guild.id, {channel:msg.channel.id, message:statusMsg.id})
		
		msg.delete()

		client.statusMonitor.process()
	}
};