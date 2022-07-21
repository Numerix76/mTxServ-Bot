const { EmbedBuilder } = require('@discordjs/builders');
const { Colors } = require('discord.js');
const got = require('got');
const mTxServUtil = require('../util/mTxServUtil');

module.exports = class StatusMonitor {
	constructor(url) {
		this.url = url
	}

	async process() {	
		const embed = new EmbedBuilder()
			.setTitle("All servers that seem to have a problem")
			.setTimestamp()

		const urlPartialOutage = `${this.url}components?sort=status&order=desc&status=3`;
		const urlMajorOutage = `${this.url}components?sort=status&order=desc&status=4`;

		await this.addDataFrom(urlPartialOutage, embed)
		await this.addDataFrom(urlMajorOutage, embed)

		if (!embed.data.fields || embed.data.fields.length === 0)
			embed.setDescription("No servers have problems")

		const guilds = await client.guilds.fetch();
		for (const guild of guilds.map(guild => guild))
		{	
			const currentConfig = await client.provider.get('status', guild.id, "")
			const statusChannel = await guild?.channels.fetch(currentConfig.channel)
			const statusMessage = await statusChannel?.messages?.fetch({ message: currentConfig.message })

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
			const embedError = new EmbedBuilder()
				.setDescription("An error occured while retrieving status data.")
				.setColor(Colors.Red);

			mTxServUtil.sendLogMessage(embedError)
			
			return;
		}

		Object.values(res.body.data)
			.map(server => {
				embed.addFields({name: server.name, value: server.status_name})
			})
	}
}