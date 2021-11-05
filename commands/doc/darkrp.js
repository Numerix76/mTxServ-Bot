const Discord = require('discord.js');
const mTxServUtil = require('../../util/mTxServUtil');
const DarkRPApi = require('../../api/DarkRPApi')

module.exports = {
	name: 'darkrp',
	aliases: ['darkrp-wiki'],
	category: 'Gmod',
	description: 'Search on DarkRP official wiki.',
	permissions: ['SEND_MESSAGES'],
	slash: 'both',

	expectedArgs: '<query>',
	expectedArgsTypes: ['STRING'],
	
	minArgs: 1,
	maxArgs: 1,	

	callback: async ({ client, message, interaction, args }) => {
		const msg = message || interaction;
		const lang = require(`../../languages/${await mTxServUtil.resolveLangOfMessage(msg)}.json`);
		const [query] = args

		const api = new DarkRPApi();
		const results = await api.search(query);

		const embed = new Discord.MessageEmbed()
			.setTimestamp()
			.setTitle(`:mag: ${lang['wiki']['search']} *${query}*`)
			.setColor('BLUE')
		;

		if (!results.length) {
			embed
				.setColor('RED')
				.addField(lang['wiki']['no_result'], `${lang['wiki']['check']} <https://darkrp.miraheze.org/>`);
		}
		else
		{
			results
				.map(article => {
					embed.addField(`:book: ${article.title}`, `<https://darkrp.miraheze.org/wiki/${article.title}>` || 'n/a');
				})
			;
		}

		return embed
	},
};
