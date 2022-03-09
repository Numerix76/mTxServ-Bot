const Parser = require('rss-parser')

class RssFeederApi {
	async get(feedUrl) {
		let parser = new Parser();
		console.log('try to parse RSS feed: ' + feedUrl);
		return await parser.parseURL(feedUrl);
	}
}

module.exports = RssFeederApi;
