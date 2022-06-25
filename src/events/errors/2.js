const { EmbedBuilder } = require("@discordjs/builders");
const { Colors } = require("discord.js");
const { Event } = require("sheweny");
const mTxServUtil = require("../../util/mTxServUtil");

module.exports = class unhandledRejectionEvent extends Event {
	constructor(client) {
		super(client, 'unhandledRejection', {
			emitter: process,
		});
	}
	execute(error) {
		if (!error) return;
		
		console.error(error.stack ? error.stack : error.toString());

		const embed = new EmbedBuilder()
			.setColor(Colors.Red)
			.setTitle('Error')
			.setDescription(error.stack ? `\`\`\`x86asm\n${error.stack.substr(0, 2048)}\n\`\`\`` : `\`${error.toString().substr(0, 2048)}\``)
			.setTimestamp();

		if ( error.method )
			embed.addFields({ name: "Method", value: `${error.method}`, inline: true })

		if ( error.path )
			embed.addFields({ name: "Path", value: `${error.path}`, inline: true })

		if ( error.code )
			embed.addFields({ name: "Code", value: `${error.code}`, inline: true })

		if ( error.httpStatus )
			embed.addFields({ name: "httpStatus", value: `${error.httpStatus}`, inline: true })

		if ( error.requestData )
			embed.addFields({ name: "requestData", value: `${error.requestData}`, inline: true })

		mTxServUtil.sendLogMessage({
			embeds: [embed]
		})
	}
};
