const { EmbedBuilder, Colors } = require('discord.js');
const got = require('got');
const mTxServUtil = require('../util/mTxServUtil');

const makeURL = (game, host, port) => `https://mtxserv.com/api/v1/viewers/game?ip=${encodeURIComponent(host)}&port=${encodeURIComponent(port)}&type=${encodeURIComponent(game)}`;

class GameServerApi {
	async status(game, host, port) {
		const res = await got(makeURL(game, host, port), {
			responseType: 'json'
		})

		if (!res || !res.body) {
			throw new Error('Invalid response of mtxserv API')
		}

		if (res.body.is_online && res.body.params.host_name && res.body.params.host_name.length) {
			res.body.params.host_name = res.body.params.host_name.replace(/\u00A7[0-9A-FK-OR]/ig,'').replace('\n', '').trim()
		}

		return res.body
	}

	async generateEmbed(interaction, gameDefault, address) {
		let game;

		game = gameDefault = gameDefault.toLowerCase();
		if (game === 'gmod') {
			game = 'garry-s-mod';
		}

		const split = address.split(':')
		const embed = new EmbedBuilder()
			.setFooter({ text: mTxServUtil.translate(interaction, ["servers", "consult", "footer"]) });

		if (split.length !== 2) {
			return embed
				.setColor(Colors.Red)
				.setTitle(address.toUpperCase())
				.setDescription(mTxServUtil.translate(interaction, ["servers", "consult", "invalid_format"]));
		}

		const iconUrl = `https://mtxserv.com/build/img/icon/game/${gameDefault}.png`;
		const results = await this.status(game, split[0], split[1])

		if (!results['is_online']) {
			return embed
				.setColor(Colors.Red)
				.setAuthor({ name: address.toUpperCase(), iconURL: iconUrl })
				.setDescription(mTxServUtil.translate(interaction, ["servers", "consult", "offline"]));
		}

		
		let gameName
		if (results.params.game == null || results.params.game === "") {
			gameName = mTxServUtil.translate(interaction, ["servers", "consult", "unknow"])
		} 
		else {
			gameName = results.params.game
		}
		
		let mapName
		if (results.params.map == null || results.params.map === "") {
			mapName = mTxServUtil.translate(interaction, ["servers", "consult", "unknow"])
		} 
		else {
			mapName = results.params.map
		}
			
		embed
			.setColor(Colors.Green)
			.setAuthor({ name: results.params.host_name, iconURL: iconUrl })
			.setTimestamp()
			.addFields([
				{
					name: mTxServUtil.translate(interaction, ["servers", "consult", "address"]), 
					value: `\`${address.toUpperCase()}\``
				},
				{
					name: mTxServUtil.translate(interaction, ["servers", "consult", "players"]),
					value: `${results.params.used_slots}/${results.params.max_slots}`,
					inline: true
				},
				{
					name: mTxServUtil.translate(interaction, ["servers", "consult", "game"]),
					value: gameName,
					inline: true
				},
				{
					name: mTxServUtil.translate(interaction, ["servers", "consult", "map"]),
					value: mapName,
					inline: true
				}
			]);

		if (results.params.joinlink) {
			embed.setDescription(`\`${results.params.joinlink}\``);
		}

		if (results.params.plugins) {
			const plugins = results.params.plugins.split(': ').join('; ').split('; ').map(plugin =>  `\`${plugin}\``).join(' ')

			embed.addFields({ name: mTxServUtil.translate(interaction, ["servers", "consult", "plugins"]), value: plugins.substring(0, 1023) });
		}

		return embed;
	}
}

module.exports = GameServerApi;