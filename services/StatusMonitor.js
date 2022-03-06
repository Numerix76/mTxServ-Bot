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
		const urlPartialOutage = `${this.url}components?sort=status&order=desc&status=3`;
		const urlMajorOutage = `${this.url}components?sort=status&order=desc&status=4`;

		await this.addDataFrom(urlPartialOutage, embed)
		await this.addDataFrom(urlMajorOutage, embed)

		if (embed.fields.length === 0)
			embed.setDescription("No servers have problems")

		for (const guild of client.guilds.cache)
		{
			let statusMessage
		
			const currentConfig = await client.provider.get('status', guild[0], "")
			const statusChannel = await guild[1].channels.cache.get(currentConfig.channel)
			await statusChannel?.messages.fetch(currentConfig.message).then(message => statusMessage = message).catch(console.error)

			if (!statusMessage)
				return;

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
			mTxServUtil.sendLogMessage( mTxServUtil.sayError(null, "An error occured whil retrieving status data.") )
			return;
		}

		Object.values(res.body.data)
            .map(server => {
				embed.addField(server.name, server.status_name)
            })
	}
}