const Discord = require('discord.js');
const mTxServUtil = require('../../util/mTxServUtil');
const HostingerApi = require('../../api/HostingerApi')

module.exports = {
	name: 'sys',
	aliases: ['system', 'vps-howto', 'howto-vps', 'vps'],
	category: 'Gmod',
	description: 'Search administration system guide.',
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

		const api = new HostingerApi()
		const results = await api.search(query)

		const embed = new Discord.MessageEmbed()
			.setTitle(`:mag: ${lang['how_to']['search']} *${query}*`)
			.setColor('BLUE')
		;

		if (!results.length) {
			embed
				.setColor('RED')
				.setDescription(lang['how_to']['no_result'])
			;
		}
		else
		{
			const articles = Object.values(results).slice(0, 10)
			for (const article of articles) {
				embed.addField(`:flag_us: ${article.title}`, `<${article.link}>`);
			}
		}

		return embed
	},
};
