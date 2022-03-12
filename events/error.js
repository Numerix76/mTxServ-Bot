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

		if ( error.method )
			embed.addField("Method", error.method, true)

		if ( error.path )
			embed.addField("Path", error.path, true)

		if ( error.code )
			embed.addField("Code", `${error.code}`, true)

		if ( error.httpStatus )
			embed.addField("httpStatus", error.httpStatus, true)

		if ( error.requestData )
			embed.addField("requestData", `${error.requestData}`, true)

		mTxServUtil.sendLogMessage(embed)
	}
};