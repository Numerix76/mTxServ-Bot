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

	static sayMessage(msg, title) {
		const embed = new Discord.MessageEmbed()
			.setDescription(title)
			.setColor('BLUE')
		;

		return msg.reply({
			embeds: [embed]
		});
	}

	static sayWarning(msg, title) {
		const embed = new Discord.MessageEmbed()
			.setDescription(title)
			.setColor('ORANGE')
		;

		return msg.reply({
			embeds : [embed]
		});
	}

	static saySuccess(msg, title) {
		const embed = new Discord.MessageEmbed()
			.setDescription(title)
			.setColor('GREEN')
		;

		return msg.reply({
			embeds : [embed]
		});
	}

	static sayError(msg, title) {
		const embed = new Discord.MessageEmbed()
			.setDescription(title)
			.setColor('RED')
		;

		return msg.reply({
			embeds : [embed]
		});
	}

	static askConfirmation(msg, title) {
		const embed = new Discord.MessageEmbed()
			.setDescription(title)
			.setColor('ORANGE')
		;

		return msg.reply({
			embeds : [embed]
		});
	}

	static ask(msg, title) {
		const embed = new Discord.MessageEmbed()
			.setDescription(title)
			.setColor('ORANGE')
		;

		return msg.reply({
			embeds : [embed]
		});
	}

	/*static async getInput(msg, inputMsg) {
		await mTxServUtil.ask(msg, inputMsg)

		const author = msg.author || msg.user

		console.log("je suis la")
		//const collector = new Discord.MessageCollector(msg.channel, m => m.author.id === author.id, { time: 40000 });
		//const userInput = collected.first()

		const filter = m => m.author.id === author.id
		msg.channel.awaitMessages({ filter, time: 40_000, errors: ['time'] }).then( collected => console.log(collected.first()))

		return "no"

		//return userInput.content.trim()
	}*/

	static async sendLogMessage(embed)
	{
		if (client.channels.cache.has(process.env.LOG_CHANNEL_ID)) {
			client.channels.cache.get(process.env.LOG_CHANNEL_ID)
				.send({
					embeds: [embed]
				})
		}
	}
};