const Discord = require('discord.js');

module.exports = class mTxServUtil {
	static onError(error, message, args, fromPattern, result) { // eslint-disable-line no-unused-vars
		console.error(error);

		const description = error.stack ? `\`\`\`x86asm\n${error.stack.substr(0, 2048)}\n\`\`\`` : `\`${error.toString().substr(0, 2048)}\``
		const embed = new Discord.MessageEmbed()
			.setColor('RED')
			.setTimestamp()
			.setTitle('Error')
			.setDescription(description)
			.addField('Command:', `${message.content.split(' ').join(' ')}`, true)
			.addField('Server ID:', `${message.channel.type !== 'dm'?message.guild.id:'DM'}`, true)
			.addField('User ID:', `<@${message.author.id}>`, true);

		mTxServUtil.sendLogMessage(embed)
	}

	static async resolveLangOfMessage(msg) {
		if (msg.channel.type !== 'DM') {
			return await mTxServUtil.getLangOfChannel(msg.channel)
		}

		return mTxServUtil.getLangOfMember(msg.member)
	}

	static async getLangOfChannel(channel) {
		const parentChannel = client.channels.cache.get(channel.parentID)

		if (parentChannel) {
			if (-1 !== parentChannel.name.indexOf('[FR]')) {
				return 'fr';
			}

			if (-1 !== parentChannel.name.indexOf('[EN]')) {
				return 'en';
			}
		}
	
		return await client.provider.get(channel.guild.id, 'language', process.env.DEFAULT_LANG)
	}

	static getLangOfMember(member) {
		if (!member) {
			return process.env.DEFAULT_LANG;
		}

		return member.roles.cache.some(role => role.name === 'FR') ? 'fr' : 'en';
	}

	static sayMessage(msg, content) {
		const embed = new Discord.MessageEmbed()
			.setDescription(content)
			.setColor('BLUE')
		;

		return embed;
	}

	static sayWarning(msg, content) {
		const embed = new Discord.MessageEmbed()
			.setDescription(content)
			.setColor('ORANGE')
		;

		return embed;
	}

	static saySuccess(msg, content) {
		const embed = new Discord.MessageEmbed()
			.setDescription(content)
			.setColor('GREEN')
		;

		return embed;
	}

	static sayError(msg, content) {
		const embed = new Discord.MessageEmbed()
			.setDescription(content)
			.setColor('RED')
		;

		return embed;
	}

	static askConfirmation(msg, content) {
		const embed = new Discord.MessageEmbed()
			.setDescription(content)
			.setColor('ORANGE')
		;

		return embed;
	}

	static ask(msg, content) {
		const embed = new Discord.MessageEmbed()
			.setDescription(content)
			.setColor('ORANGE')
		;

		return embed;
	}

	static async sendLogMessage(embed)
	{
		if (client.channels.cache.has(process.env.LOG_CHANNEL_ID)) {
			client.channels.cache.get(process.env.LOG_CHANNEL_ID)
				.send({
					embeds: [embed]
				})
		}
	}

	static async editResponse(message, interaction, options)
	{
		if ( interaction )
			interaction.editReply(options)
		else
			message.edit(options);
	}
};