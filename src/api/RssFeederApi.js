const { EmbedBuilder } = require('@discordjs/builders');
const { Colors } = require('discord.js');
const Parser = require('rss-parser');
const mTxServUtil = require('../util/mTxServUtil');

class RssFeederApi {
	async get(feedUrl) {
		let parser = new Parser();
		console.log('try to parse RSS feed: ' + feedUrl);

		let result;
		try{
			result = await parser.parseURL(feedUrl)
		} catch (error)
		{
			console.error(error.stack ? error.stack : error.toString());

			const embed = new EmbedBuilder()
			.setColor(Colors.Red)
			.setTitle('Error')
			.setDescription(error.stack ? `\`\`\`x86asm\n${error.stack.substr(0, 2048)}\n\`\`\`` : `\`${error.toString().substr(0, 2048)}\``)
			.addFields({name: "URL", value: feedUrl})
			.setTimestamp();

			mTxServUtil.sendLogMessage({
				embeds: [embed]
			})
		}

		return result;
	}
}

module.exports = RssFeederApi;
