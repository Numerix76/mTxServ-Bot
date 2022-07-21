const RssFeederApi = require('../api/RssFeederApi')
const striptags = require('striptags')
const LinkPreview = require('link-preview-js');
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

				const dataURL = await LinkPreview.getLinkPreview(article.link);
				let content = '';

				if (dataURL.description)
					content = dataURL.description;
				else
					content = article['contentSnippet'] || article['content'] || article['content:encodedSnippet'];
				
				if (dataURL.images?.length > 0)
					embed.setImage(dataURL.images[0]);

				content = striptags(content).replace(/(?:https?|ftp):\/\/[\n\S]+/g, '').trim();
				content = content.length > 300 ? content.substr(0, 300) : content;

				embed.setDescription(`${content}\n${article.link}`);

				const primaryTag = feed.tags instanceof Array ? feed.tags[0] : feed.tags

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

	static async sendArticle(guild, channelID, article)
	{
		try
		{
			const channel = await guild.channels.fetch(channelID);
			
			if( !guild.members.me.permissionsIn(channel).has(PermissionsBitField.Flags.SendMessages) ) {
				console.log("No permission to send the article")
				return;
			}
	
			channel.send({ embeds: [article] }).catch((err) =>console.log(err));

		}catch(e)
		{
			console.log(`Channel ${channelID} not found or can't send in it`)
		}
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