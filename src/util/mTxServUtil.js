const { EmbedBuilder, Colors } = require("discord.js");

module.exports = class mTxServUtil {
	/*static onError(error, message, args, fromPattern, result) { // eslint-disable-line no-unused-vars
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
	}*/

	static translate(interaction, arrPath, replace)
	{
		let translated;
		
		translated = mTxServUtil.translateTo(interaction.locale, arrPath, replace);

		if ( translated )
			return translated;

		translated = mTxServUtil.translateTo(client.defaultLanguage, arrPath, replace);

		if ( translated )
			return translated;

		return arrPath.join(" > ");
	}

	static translateTo(language, arrPath, replace) {
		let phrase = client.languages[language];
		for (let i = 0; i < arrPath.length; i++) {
			if ( !phrase )
				break;

			phrase = phrase[ arrPath[i] ];
		}

		if ( !phrase || !replace )
			return phrase;

		for (const [key, value] of Object.entries(replace)) {
			phrase = phrase.replace(`%${key}%`, value);
		}

		return phrase;
	}

	/*static async resolveLangOfMessage(msg) {
		return await mTxServUtil.getLangOfMember(msg.member)
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
	
		return await client.provider.get(channel.guild.id, 'language', client.language)
	}

	static async getLangOfMember(member) {
		if (!member) {
			return client.language;
		}

		if ( member.guild.roles.cache.some(role => (role.name === 'FR' || role.name === 'EN')) )
			return member.roles.cache.some(role => role.name === 'FR') ? 'fr' : 'en';
		else
			return await client.provider.get(member.guild.id, 'language', client.language)
	}*/

	static sayMessage(content) {
		const embed = new EmbedBuilder()
			.setDescription(content)
			.setColor(Colors.Blue)
		;

		return embed;
	}

	static sayWarning(content) {
		const embed = new EmbedBuilder()
			.setDescription(content)
			.setColor(Colors.Orange)
		;

		return embed;
	}

	static saySuccess(content) {
		const embed = new EmbedBuilder()
			.setDescription(content)
			.setColor(Colors.Green)
		;

		return embed;
	}

	static sayError(content) {
		const embed = new EmbedBuilder()
			.setDescription(content)
			.setColor(Colors.Red)
		;

		return embed;
	}

	/*static askConfirmation(content) {
		const embed = new Discord.MessageEmbed()
			.setDescription(content)
			.setColor('ORANGE')
		;

		return embed;
	}*/

	/*static ask(content) {
		const embed = new Discord.MessageEmbed()
			.setDescription(content)
			.setColor('ORANGE')
		;

		return embed;
	}*/

	static async sendLogMessage(options)
	{
		if (client.channels.cache.has(client.logChannel)) {
			client.channels.cache.get(client.logChannel)
				.send(options)
		}
		else
		{
			console.log("Log channel invalid");
		}
	}

	/*static async editResponse(message, interaction, options)
	{
		if ( interaction )
			interaction.editReply(options)
		else
			message.edit(options);
	}*/
};