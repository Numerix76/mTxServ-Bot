const Discord = require('discord.js')
const mTxServUtil = require('../util/mTxServUtil.js')

module.exports = {
	emitter: process,
	run: (error) => {
		if (!error) return;

		const errorMsg = (error ? error.stack || error : '').toString().replace(new RegExp(`${__dirname}\/`, 'g'), './');
		console.error(error.stack ? error.stack : error.toString());

		const embed = new Discord.MessageEmbed()
			.setColor(15684432)
			.setTitle('Uncaught Exception')
			.setDescription(`\`\`\`x86asm\n${errorMsg.substr(0, 2048)}\n\`\`\``)
			.addField('Error Name :', `\`${error.name || 'N/A'}\``)
			.addField('Error Message :', `\`${error.message || 'N/A'}\``)
			.setTimestamp();

		mTxServUtil.sendLogMessage(embed)
	}
}