const RssFeederApi = require('../api/RssFeederApi')
const striptags = require('striptags')
const Grabity = require("grabity")
const { Colors, PermissionsBitField } = require('discord.js')
const { EmbedBuilder } = require('@discordjs/builders')

module.exports = class FeedMonitor {
	constructor(feeds) {
		this.feeds = feeds
		this.rssFeeder = new RssFeederApi()
	}

	getCacheKey() {
		return isDev ? 'feeds_cache_dev' : 'feeds_cache'
	}

	async warmup() {
		console.log('mTxBot > Setup FeedMonitor')
		const links = [];

		for (const feed of this.feeds) {
			const results = await this.rssFeeder.get(feed.url)
			if (!results) continue;
			
			const articles = Object.values(results.items)

			for (const article of articles) {
				links.push(article.link)
			}
		}

		await client.provider.set('global', this.getCacheKey(), links)
		console.log('mTxBot > Finished setup FeedMonitor')
	}

	async process() {
		let oldArticles = await client.provider.get('global', this.getCacheKey(), [])

		for (const feed of this.feeds) {
			const results = await this.rssFeeder.get(feed.url)

			if (!results) continue;

			const articles = Object.values(results.items)

			for (const article of articles) {
				if (oldArticles.indexOf(article.link) !== -1) {
					continue
				}

				oldArticles.push(article.link)
				client.provider.set('global', this.getCacheKey(), oldArticles)

				const embed = new EmbedBuilder()
					.setAuthor({name: results.title, iconURL: feed.icon, url: article.link})
					.setTitle(`:newspaper: ${article.title}`)
					.setColor(Colors.Blue)
					.setTimestamp()

				let it = await Grabity.grabIt(article.link)
				let content = ''

				if (it.content || it.description) {
					content = it.content || it.description
					if (it.image) {
						embed.setImage(it.image)
					}
				} else {
					content = article['contentSnippet'] || article['content'] || article['content:encodedSnippet']
				}

				content = striptags(content).replace(/(?:https?|ftp):\/\/[\n\S]+/g, '').trim();
				content = content.length > 300 ? content.substr(0, 300) : content

				embed.setDescription(`${content}\n${article.link}`)

				const primaryTag = feed.language instanceof Array ? feed.tags[0] : feed.tags

				for (const guild of client.guilds.cache.map(guild => guild)) {
					const followAll = await FeedMonitor.isFollowing(guild.id, primaryTag, 'all', false)
					
					// send to specified guild channel (user conf)
					if (followAll) {
						FeedMonitor.sendArticle(guild, followAll, embed)
					}

					if ( feed.language instanceof Array )
					{
						for(const language of feed.language)
						{
							const followLocalized = await FeedMonitor.isFollowing(guild.id, primaryTag, language, false)

							if (followLocalized) {
								FeedMonitor.sendArticle(guild, followLocalized, embed)
							}
						}
					}								
				}
			}
		}
	}

	static sendArticle(guild, channel, article)
	{
		if (!client.channels.cache.has(channel)) {
			console.error(`Channel ${channel} not found`)
			return
		}
		
		if( !guild.members.me.permissionsIn(channel).has(PermissionsBitField.Flags.SendMessages) ) {
			console.log("No permission to send the article")
			return
		}

		if ( typeof client.channels.cache.get(channel).send === "function" )
			client.channels.cache.get(channel).send({ embeds: [article] })	
	}

	static async isFollowing(guildId, game, language, defaultValue) {
		const snapshot = await client.provider.rootRef
			.child(guildId)
			.child('feeds_suscribed')
			.child(game)
			.child(language)
			.once("value")

		const value = snapshot.val()

		return value == null ? defaultValue : value;
	}
}