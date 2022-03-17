const Parser = require('rss-parser')
const mTxServUtil = require('../util/mTxServUtil');
const Discord = require("discord.js");

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

			const embed = new Discord.MessageEmbed()
				.setColor(15684432)
				.setTitle('Error')
				.setDescription(error.stack ? `\`\`\`x86asm\n${error.stack.substr(0, 2048)}\n\`\`\`` : `\`${error.toString().substr(0, 2048)}\``)
				.setTimestamp()
				.addField("RSS Feed URL", `${feedUrl}`)

			mTxServUtil.sendLogMessage( embed )
		}
		return result;
	}
}

module.exports = RssFeederApi;
