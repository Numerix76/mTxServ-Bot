const Discord = require('discord.js');
const mTxServUtil = require('../../util/mTxServUtil');
const fs = require("fs");

module.exports = {
	name: 'bot-lang',
	aliases: ['bot-language'],
	category: 'Bot',
	description: 'Display bot infos.',
	permissions: ['ADMINISTRATOR'],
	slash: false,

	expectedArgs: '<language>',
	expectedArgsTypes: ['STRING'],
    
    minArgs: 1,
    maxArgs: 1,	

	callback: async ({ client, message, interaction, args }) => {
		const msg = message || interaction;

		const [language] = args
		let lang = require(`../../languages/${await mTxServUtil.resolveLangOfMessage(msg)}.json`)

		try
		{
			lang = require(`../../languages/${language}.json`)
			client.provider.set(msg.guild.id, 'language', language)
			mTxServUtil.saySuccess(msg, lang['language']['updated'].replace('%lang%', language))
		}
		catch (error)
		{
			mTxServUtil.sayError(msg, lang['language']['failed'].replace('%lang%', language))
		}
	},
};
