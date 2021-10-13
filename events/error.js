const Discord = require('discord.js')
const mTxServUtil = require('../util/mTxServUtil.js')

module.exports = {
	run: (error) => {
		if (!error) return;

		console.error(error.stack ? error.stack : error.toString());

		const embed = new Discord.MessageEmbed()
			.setColor(15684432)
			.setTitle('Error')
			.setDescription(error.stack ? `\`\`\`x86asm\n${error.stack.substr(0, 2048)}\n\`\`\`` : `\`${error.toString().substr(0, 2048)}\``)
			.setTimestamp();

		mTxServUtil.sendLogMessage(embed)
	}
};