const Discord = require('discord.js')
const got = require('got');
const mTxServUtil = require('../util/mTxServUtil');

module.exports = class FeedMonitor {
	constructor(url) {
		this.url = url
	}

	async process() {	
		const embed = new Discord.MessageEmbed()
			.setTitle("All servers that seem to have a problem")
			.setTimestamp()

		const urlPartialOutage = `${this.url}components?sort=status&order=desc&status=3`;
		const urlMajorOutage = `${this.url}components?sort=status&order=desc&status=4`;

		await this.addDataFrom(urlPartialOutage, embed)
		await this.addDataFrom(urlMajorOutage, embed)

		if (embed.fields.length === 0)
			embed.setDescription("No servers have problems")

		for (const guild of client.guilds.cache.map(guild => guild))
		{	
			const currentConfig = await client.provider.get('status', guild.id, "")
			const statusChannel = await guild.channels.cache.get(currentConfig.channel)
			const statusMessage = await statusChannel?.messages.cache.get(currentConfig.message)

			if (!statusMessage) continue;

			statusMessage.edit({
				content:null,
				embeds:[embed]
			})
		};
	}

	async addDataFrom(url, embed)
	{
		let res = await got(url, {
			responseType: 'json'
		})

		if (!res || !res.body)
		{
			mTxServUtil.sendLogMessage( mTxServUtil.sayError(null, "An error occured while retrieving status data.") )
			return;
		}

		Object.values(res.body.data)
            .map(server => {
				embed.addField(server.name, server.status_name)
            })
	}
}