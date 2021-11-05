const Discord = require('discord.js');
const mTxServUtil = require('../../util/mTxServUtil');
const { Index } = require('flexsearch');
const puppeteer = require('puppeteer');

module.exports = {
	name: 'glua',
	aliases: ['gmod-wiki'],
	category: 'Gmod',
	description: 'Search on GMod official wiki.',
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

		const url = "https://wiki.facepunch.com/gmod/";

		try {
			const browser = await puppeteer.launch({
				headless: true,
				args: ['--no-sandbox']
			});
			const page = await browser.newPage();
			await page.goto(url);

			hrefs = await page.$$eval('#contents details.level1 a', as => as.map((a) => {
				return {
					title: a.textContent,
					link: a.href
				}
			}));
			await browser.close();

			const index = new Index();
			for (const k in hrefs) {
				index.add(k, hrefs[k]['title'])
			}

			const embed = new Discord.MessageEmbed()
				.setTimestamp()
				.setTitle(`:mag: ${lang['wiki']['search']} *${query}*`)
				.setColor('BLUE')
			;

			const results = index.search(query, 5)
			if (!results.length) {
				embed
					.setColor('RED')
					.addField(lang['wiki']['no_result'], `${lang['wiki']['check']} <${url}>`);
			}
			else
			{
				results
					.map(key => {
						embed.addField(`:book: ${hrefs[key].title}`, `<${hrefs[key].link}>` || 'n/a');
					})
			}

			return embed
		} catch (error) {
			console.error(error)
			return mTxServUtil.sayError(msg, lang['wiki']['search_failed'])
		}
	},
};
