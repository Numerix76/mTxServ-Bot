const Discord = require('discord.js');
const mTxServUtil = require('../../util/mTxServUtil');
const HowToApi = require('../../api/HowToApi')

module.exports = {
	name: 'howto',
    aliases: ['search', 'tuto'],
	category: 'mTxServ',
	description: 'Search a tutorial.',
	permissions: ['SEND_MESSAGES'],
	slash: 'both',

	expectedArgs: '<locale> <query>',
	expectedArgsTypes: ['STRING', 'STRING'],

	minArgs: 2,

	options: [
		{
			name: 'locale',
			description: 'Which language?',
			required: true,
			type: 'STRING',
			choices: [
				{
					name: "French",
					value: "fr"
				},
			 	{
					name: "English",
					value: "en"
				},
				{
					name: "All",
					value: "all"
				},
			]
		},
		{
			name: 'query',
			description: 'Which language?',
			required: true,
			type: 'STRING',
		}
	],

	callback: async ({ client, message, interaction, args }) => {
		const msg = message || interaction;
		const lang = require(`../../languages/${await mTxServUtil.resolveLangOfMessage(msg)}.json`);

		const [locale] = args
		
		const locales = ['fr', 'en', 'all']
		if (locales.indexOf(locale) === -1) {
			return mTxServUtil.sayError(msg, lang["how_to"]["invalid_locale"])
		}

		const userLang = locale === 'all' ? await mTxServUtil.resolveLangOfMessage(msg) : locale || await mTxServUtil.resolveLangOfMessage(msg);


		args.shift()
		const query = args.join(" ")

		const api = new HowToApi()
        const results = await api.search(query)

        const embed = new Discord.MessageEmbed()
            .setTitle(`:mag: ${lang['how_to']['search']} *${query}*`)
            .setColor('BLUE')
        ;

        const tutorials = Object.values(results);

        tutorials
            .filter(article => {
                return locale === 'all' || article.locale == userLang
            })
            .map(article => {
                embed.addField(`${article.locale == 'fr' ? ':flag_fr:' : ':flag_us:'} ${article.title}`, `<${article.link}>` || 'n/a');
            })
        ;

        if (!embed.fields.length) {
            const helpUrl = userLang == 'fr' ? 'https://mtxserv.com/fr/help': 'https://mtxserv.com/help';
            embed
                .setColor('RED')
                .addField(lang['how_to']['no_result'], `${lang['how_to']['check']} <${helpUrl}>`);
        }

        embed.fields = embed.fields.slice(0, 3);

        return embed
	},
};
