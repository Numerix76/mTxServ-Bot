const Discord = require('discord.js');
const mTxServUtil = require('../../util/mTxServUtil');
const paginationEmbed = require('../../util/pagination');
const GameApi = require('../../api/GameApi')
const { Permissions } = Discord


module.exports = {
	name: 'ranked-servers',
	aliases: ['ranked', 'ranked-server', 'ranked-serveur', 'top-serveur', 'top-server', 'top-serveurs', 'top-servers', 'topserveur', 'topserver', 'topserveurs', 'topservers', 'topsrv', 'top-srv'],
	category: 'Game server',
	description: 'Game Servers Ranking of the specified game.',
	permissions: ['SEND_MESSAGES'],
	hidden: false,
	slash: 'both',

	expectedArgs: '<game>',
	expectedArgsTypes: ['STRING'],

	minArgs: 1,
	maxArgs: 1,

	options: [
		{
		  name: 'game',
		  description: 'Which game ranking (minecraft, gmod, fivem, rust, ark, etc)?',
		  required: true,
		  type: 'STRING',
		  choices: [
				{
					name: "Minecraft",
					value: "minecraft"
				},
				{
					name: "Garry's Mod",
					value: "gmod"
				},
				{
					name: "Ark",
					value: "ark"
				},
				{
					name: "Rust",
					value: "rust"
				},
				{
					name: "Onset",
					value: "onset"
				},
				{
					name: "Arma 3",
					value: "arma3"
				},
				{
					name: "Valheim",
					value: "valheim"
				},
			]
		},
	],


	callback: async ({ client, message, interaction, args }) => {
		const msg = message || interaction
		const userLang = await mTxServUtil.resolveLangOfMessage(msg)
		const lang = require(`../../languages/${userLang}.json`)

		let [game] = args

		const games = ['minecraft', 'gmod', 'ark', 'rust', 'onset', 'arma3', 'valheim'];
		
		if (games.indexOf(game) === -1)
			return mTxServUtil.sayError(msg, lang["gs_status"]["game_not_exist"]);

		game = GameApi.translateGameSlug(game.toLowerCase())
		
		const api = new GameApi()
		const results = await api.getRankingOfGame(game)

		const baseUrl = userLang === 'fr' ? 'https://top-serveurs.net' : 'https://top-games.net'
		const iconUrl = `${baseUrl}/favicon-32x32.png`

		const gameServers = Object.values(results);

		if (!gameServers.length || !gameServers[0].length) {
			const embed = new Discord.MessageEmbed()
				.setTitle(lang['top-servers']['title'].replace('%game%', game[0].toUpperCase() + game.substring(1)))
				.setDescription(lang['top-servers']['no_result'].replace('%game%', game))
				.setColor('ORANGE')
				.setFooter(baseUrl.replace('https://', ''))
			;

			return embed
		}

		const pages = []

		for (const gameServer of gameServers[0]) {

			let icon = ''
			if (gameServer.rank === 1) {
				icon = ':first_place: '
			} else if (gameServer.rank === 2) {
				icon = ':second_place: '
			} else if (gameServer.rank === 3) {
				icon = ':third_place: '
			}

			const gsEmbed = new Discord.MessageEmbed()
				.setTitle(`${icon}${gameServer.name}`, iconUrl, gameServer.top_url)
				.setDescription(gameServer.short_description)
				.setColor('GREEN')
				.setFooter(baseUrl.replace('https://', ''))
				.addField(lang['top-servers']['view'], `[${lang['top-servers']['view_more']}](${gameServer.top_url})`)
				.addField(`:chart_with_upwards_trend: ${lang['top-servers']['view_ranking']}`, `[${lang['top-servers']['view_ranking']} ${game}](${gameServer.ranking_url})`, true)
				.addField(lang['top-servers']['rank'], `${gameServer.rank}`, true)
			;

			if (gameServer.banner_url) {
				gsEmbed.setImage(gameServer.banner_url)
			}

			if (gameServer.average_advices) {
				let rating = '';
				for (let i = 1; i <= gameServer.average_advices; i++) {
					rating = rating + ':star:';
				}

				gsEmbed.addField(lang['top-servers']['players_ranking'], `${rating}`, true)
			}

			pages.push(gsEmbed)
		}

		if (pages.length === 1) {
			const embed = pages[0]
			return embed
		}

		paginationEmbed(msg, interaction, pages);
	}
};