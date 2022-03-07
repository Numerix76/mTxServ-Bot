const Discord = require('discord.js')
const Grabity = require("grabity");
const getUrls = require('get-urls');
const URL = require('url').URL
const { stripInvites, extractInviteLink } = require('../util/Util');
const mTxServApi = require('../api/mTxServApi')

module.exports = {
	run: async (msg) => {
		if (msg.channel.type !== 'GUILD_TEXT') return;
		if (msg.author.bot) return;
		if ( isDev ) return;
		if ( !client.isMainGuild(msg.guild.id) ) return;

		/*------------------*/
		/* Ranker system    */
		/*------------------*/
		if ( msg.member.displayName ) {
			client.ranker.processMessage(msg)
		}
		
		/*--------------------*/
		/* mTxServ user role  */
		/*--------------------*/
		const mTxServUserApi = new mTxServApi()
		const roleMtxServ = '773540951434985503';
		if ( await mTxServUserApi.isAuthenticated(msg.author.id) ) 
		{
			const role = msg.guild.roles.cache.get(roleMtxServ)
			if (role && !msg.member.roles.cache.has(role.id)) {
				msg.member.roles.add(role).catch(console.error);
			}
		}
		
		/*-------------------------*/
		/* Channel with auto embed */
		/*-------------------------*/
		const roleGameServ = '773500803218538546'
		if ( module.exports.needToMessageEmbed(msg.channel.name) )
		{
			const inviteLink = extractInviteLink(msg.content)

			let content = Discord.Util.removeMentions(msg.content).trim()
			if (!content) return;

			const urls = getUrls(stripInvites(content));
			const link = inviteLink ? inviteLink : (urls.values().next().value || null);

			const embed = new Discord.MessageEmbed()
				.setAuthor(`${msg.author.tag}`, `${msg.author.displayAvatarURL()}`, link)
				.setColor(Math.floor(Math.random() * 16777214) + 1)
				.setDescription(content)
			

			module.exports.addDiscordLink(inviteLink, embed)
			module.exports.addThumbnail  (link, embed)
			module.exports.addURLToEmbed (urls.values(), embed)
			

			const attachments = msg.attachments.map(attachment => attachment)

			for (const attachment of attachments) {
				embed.setImage(`attachment://${attachment.name}`)
			}

			const embedMsg = await msg.channel.send({
				embeds: [embed],
				files: attachments
			})

			embedMsg.react('👍');
			embedMsg.react('👎');
				
			if ( -1 !== msg.channel.name.indexOf('serveurs') || -1 !== msg.channel.name.indexOf('servers') )
			{
				const role = msg.guild.roles.cache.get(roleGameServ)
				if ( role && !msg.member.roles.cache.has(role.id) ) {
					msg.member.roles.add(role).catch(console.error);
				}
			}

			msg.delete()
				
			return;
		}
	},

	needToMessageEmbed: (channelName) =>
	{
		const nameValid = ['serveurs', 'servers', 'règlement', 'rules', 'recrutements', 'partenaires', 'partners']
		const nameNotValid = ['discuss-partners']
		var valid = false
		
		for (const name of nameValid)
		{
			if (!valid) { // Only change the state of valid if it was false
				valid = channelName.indexOf(name) !== -1
			}
		}
		
		for (const name of nameNotValid)
		{
			if (valid) { // Only change the state of valid if it was true
				valid = channelName.indexOf(name) === -1
			}
		}
		return valid
	},

	addDiscordLink: async (link, embed) => {
		if (null === link) return

		const metadata = await Grabity.grabIt(link)

		if (metadata.title && -1 !== metadata.title.indexOf('Join the ')) {
			const title = metadata.title.replace('Discord Server!', '').replace('Join the', '')
			embed
				.setTitle(title)
				.addField('Discord', `[${title}](${link})`, true)
		}
	},

	addThumbnail: async (link, embed) => {
		if (null === link) return

		const url = new URL(link)
		const metadata = await Grabity.grabIt(link)

		if (metadata.image) {
			if ('/' === metadata.image.substr(0, 1)) {
				metadata.image = `${url.protocol}//${url.host}${metadata.image}`
			}

			const isValidUrl = /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(metadata.image)
			if (isValidUrl) {
				embed.setThumbnail(metadata.image)
			}
		}
	},

	addURLToEmbed: async (items, embed) => {
		let item = items.next()

		let metadata
		do {
			try {
				if (!item.value) {
					break
				}

				metadata = await Grabity.grabIt(item.value)
				if (metadata && metadata.title) {
					let title = metadata.title

					if (-1 !== item.value.indexOf('top-serveurs.net')) {
						title = 'Top Serveurs'
					}

					if (-1 !== item.value.indexOf('steamcommunity.com') ) {
						if (-1 !== metadata.title.indexOf('Steam Workshop::')) {
							title = 'Steam Workshop'
						} else if (-1 !== metadata.title.indexOf('Steam Community :: Group')) {
							title = 'Steam Group'
						}
					}

					const description = title !== metadata.title ? `[View ${title}](${item.value})` : `[${title}](${item.value})`
					embed.addField(title, description, true)
				}
			} catch (err) {

			}
		}
		while (item = items.next())
	}
};