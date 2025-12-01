const { EmbedBuilder } = require('@discordjs/builders');
const { Colors } = require('discord.js');
const {got} = require('got');
const mTxServUtil = require('../util/mTxServUtil');

module.exports = class StatusMonitor {
	constructor(url) {
		this.url = url
	}

	async process() {	
		const embed = new EmbedBuilder()
			.setTitle("All servers that seem to have a problem")
			.setTimestamp()

		const urlPartialOutage = `${this.url}components?sort=name&order=desc&filter[status]=3`;
		const urlMajorOutage = `${this.url}components?sort=name&order=desc&filter[status]=4`;

		await this.addDataFrom(urlPartialOutage, embed)
		await this.addDataFrom(urlMajorOutage, embed)

		if (!embed.data.fields || embed.data.fields.length === 0)
			embed.setDescription("No servers have problems")

		let guilds = await client.guilds.fetch()
		
		for (const oauthGuild of guilds.map(guild => guild))
		{
			const guild = await oauthGuild.fetch()
			if ( !guild.id ) continue;
			
			try
			{
				const currentConfig = await client.provider.get('status', guild.id, "")	
				const statusChannel = await guild?.channels.fetch(currentConfig.channel)
				const statusMessage = await statusChannel?.messages?.fetch({ message: currentConfig.message })
	
				if (!statusMessage) continue;
	
				statusMessage.edit({
					content:null,
					embeds:[embed]
				}).catch(err => console.log(err))
			} catch(error)
			{
				if (error.code == 10008)
					console.log(`[StatusMonitor] Can't find the message in the guild ${guild.id}`)
			}
		}
	}

	async addDataFrom(url, embed)
	{
		let res = await got.get(url, {
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

		Object.values(res.body.data).slice(0, 24-(embed.data.fields?.length ?? 0))
			.map(server => {
				embed.addFields({name: server.name, value: server.status_name})
			})
	}
}