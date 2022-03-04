const Discord = require('discord.js')
const mTxServUtil = require('../util/mTxServUtil.js')

module.exports = {
	run: () => {
		console.log(`Logged in as ${client.user.tag}! (${client.user.id})`);

		client.feedMonitor.warmup()
		client.inviteManager.warmup()
		client.statusUpdater.updateStatus()

		setInterval(() => client.statusUpdater.updateStatus(), 1000 * 60)

		setInterval(async () => {
		    try {
		        client.feedMonitor.process()
		    } catch (err) {
		        console.error(err);
		    }
		}, 1000 * 60 * 10);
		
		const embed = new Discord.MessageEmbed()
			.setAuthor(`${client.user.tag}`, `${client.user.displayAvatarURL()}`)
			.setColor('GREEN')
			.setTitle(':green_circle: Bot is online')
			.setTimestamp();

		mTxServUtil.sendLogMessage(embed)

		console.log(`${client.user.tag} is ready!`);
	}
}