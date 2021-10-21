const Discord = require('discord.js');
const mTxServUtil = require('../../util/mTxServUtil');
const mTxServApi = require('../../api/mTxServApi');
const { auth } = require('firebase-admin');

module.exports = {
	name: 'login',
	aliases: ['signin'],
	category: 'User',
	description: 'Link your discord account with your mTxServ account.',
	permissions: ['SEND_MESSAGES'],
	slash: 'both',

	callback: async ({ client, message, interaction, args }) => {
		const msg = message || interaction;

		const lang = require(`../../languages/${await mTxServUtil.resolveLangOfMessage(msg)}.json`);
		const author = msg.author || msg.user

		const api = new mTxServApi()
		if (await api.isAuthenticated(author.id)) {
			const embed = new Discord.MessageEmbed()
				.setDescription(lang['login']['already_connected'])
				.setColor('GREEN')
			;

			msg.reply({
				embeds: [embed]
			});

			return
		}
		

		if (msg.channel.type !== 'DM') {
			const embed = new Discord.MessageEmbed()
				.setDescription(lang['login']['sent_dm'])
				.setColor('BLUE')
			;

			msg.reply({
				embeds: [embed]
			});

			return
		}

		const embed = new Discord.MessageEmbed()
			.setTitle(lang['login']['title'])
			.setDescription(`${lang['login']['description']}`)
			.setColor('BLUE')
			.addField('client id & client secret', `<https://mtxserv.com/fr/mon-compte/oauth>`)
			.addField('api key', `<https://mtxserv.com/fr/mon-compte/api>`)
		;

		await msg.channel.send({
			embeds: [embed]
		})

		mTxServUtil.ask(msg, lang['login']['confirmation']);

		const filter = m => m.author.id === author.id
		const collector = msg.channel.createMessageCollector({
			filter,
			max: 1,
			time: 40_000, 
			errors: ['time'] })
		
		collector.on('collect', message => { 
			if (message.content !== 'yes' && message.content !== 'oui') {
				mTxServUtil.sayError(msg, lang['login']['cancelled'])
			}
			else
			{
				module.exports.getCredentials(msg, author, lang, api)
			}
		})

		collector.on('end', collected => {
			if (collected.size === 0)
				mTxServUtil.sayError(msg, lang['login']['cancelled'])
		})
	},

	getCredentials: (msg, author, lang, api) => {
		const question  = ['client_id', 'client_secret', 'api_key']
		let numQuestion = 0

		const filter = m => m.author.id === author.id
		mTxServUtil.ask(msg, lang["login"]["askCredential"].replace("%credential%", question[numQuestion++]));
		const collectCredentials = msg.channel.createMessageCollector({
			filter, 
			time: 40_000*3,
			idle: 40_000,
			max: 3,
			errors: ['time']
		})

		collectCredentials.on('collect', message => {
			if ( numQuestion !== 3 )
				mTxServUtil.ask(msg, lang["login"]["askCredential"].replace("%credential%", question[numQuestion++]));
		})

		collectCredentials.on('end', async collected => {
			if ( collected.size === 3 )
			{
				collected = collected.first(3)

				try {
					await api.login(collected[0].content, ollected[1].content, collected[2].content);
					api.setCredential(author.id, credentials)
		
					mTxServUtil.saySuccess(msg, lang["login"]["successfull"])
				} catch (err) {
					console.error(err)
					mTxServUtil.sayError(msg, lang["login"]["bad_credentials"])
				}
			}
			else
			{
				mTxServUtil.sayError(msg, lang["login"]["timeout"])
			}
		})
	}
};