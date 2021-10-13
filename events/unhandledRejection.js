const Discord = require('discord.js')
const mTxServUtil = require('../util/mTxServUtil.js')

module.exports = {
	emitter: process,
	run: (error) => {
		if (!error) return;

		console.error(error.stack ? error.stack : error.toString());

		const embed = new Discord.MessageEmbed()
			.setColor(15684432)
			.setTitle('Unhandled Rejection | Uncaught Promise error:')
			.setDescription(`\`\`\`x86asm\n${(error.stack || error.toString()).substr(0, 2048)}\n\`\`\``)
			.addField('Error Message :', `\`${error.message || 'N/A'}\``)
			.setTimestamp();

		mTxServUtil.sendLogMessage(embed)
	}
}