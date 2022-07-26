const got = require('got');
const cheerio = require('cheerio');

const websiteURL = {
	darkrp: "https://darkrp.miraheze.org/w/api.php?action=query&list=search&srsearch=%query%&srwhat=title&format=json",
	mtxserv: "https://mtxserv.com/api/v1/articles/?query=%query%",
	system: "https://www.hostinger.com/tutorials/?s=%query%",
	glua: "https://wiki.facepunch.com/gmod/~pagelist?format=json",
	bukkit: "https://mtxserv.com/api/v1/bukkit/search?query=%query%",
	spigot: "https://mtxserv.com/api/v1/spigot/search?query=%query%",
}

module.exports = class SearchAPI {
	constructor(website)
	{
		this.website = website;

		this.url = websiteURL[website];

		if ( !this.url )
			throw new Error("Website not correct");
	}

	async search(query, language) {
		const res = await got(this.makeURL(query), {
			responseType: this.website === "system" ? 'text' : 'json'
		})

		if (!res || !res.body) {
			throw new Error(`Invalid response of ${this.url}`);
		}

		let data;
		switch(this.website)
		{
			case "darkrp": {
				data = res.body.query.search.map( article => ({ title: article.title, url: `https://darkrp.miraheze.org/wiki/${article.title}` }) );

				break;
			}
			case "mtxserv": {
				data = res.body;

				if ( language !== 'all' )
					data = data.filter(article => { return article.locale == language; });
				
				data = data.map( article => ({ title: article.title, url: article.link }) )
				
				break;
			}
			case "system": {
				const $ = cheerio.load(res.body);
				data = [];

				$('.tutorials-list__cards-container a.tutorials-list__card').each(function() {
					const link = $(this).attr('href');
					const title = $(this).find('h4.text-center').text()

					if (link && title)
						data.push({ title: title.trim(), url: `https://www.hostinger.com/tutorials/${link}` });
				});

				break;
			}	
			case "glua": {
				data = res.body
					.filter(article => { return article.address.indexOf(query) !== -1; })
					.map( article => ({ title: article.address, url: `https://wiki.facepunch.com/gmod/${article.address}`}));
				
				break;
			}
			case "bukkit": {
				data = res.body.map( article => ({ title: article.name, url: article.view_url }) )
		
				break;
			}
			case "spigot": {
				data = res.body.map( article => ({ title: article.name, url: article.view_url }) )
				
				break;
			}
		}

		return data;
	}

	makeURL(query)
	{
		return this.url.replace("%query%", query);
	}
}