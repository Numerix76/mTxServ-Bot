const Discord = require('discord.js');
const mTxServUtil = require('../../util/mTxServUtil');
const GameServerApi = require('../../api/GameServerApi')


module.exports = {
	name: 'status',
	aliases: [],
	category: 'status',
	description: 'Check if a game server is online or offline.',
	permissions: ['SEND_MESSAGES'],
	hidden: false,
	slash: 'both',

	expectedArgs: '<game> <address>',
	expectedArgsTypes: ['STRING', 'STRING'],

	minArgs: 2,
	maxArgs: 2,

	options: [
		{
		  name: 'game',
		  description: 'Which game (minecraft, gmod, fivem, rust, ark, etc)?',
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
		{
			name: 'address',
			description: 'Address of server (eg: game.fr.01.mtxserv.com:27030)?',
			required: true,
			type: 'STRING',
		}
	],

	callback: async ({ client, message, interaction, args }) => {
		const msg = message || interaction;
		const [game, address] = args
		const lang = require(`../../languages/${await mTxServUtil.resolveLangOfMessage(msg)}.json`);

		const games = ['minecraft', 'gmod', 'ark', 'rust', 'onset', 'arma3', 'valheim'];

		if (games.indexOf(game) === -1)
				return mTxServUtil.sayError(msg, lang["gs_status"]["game_not_exist"]);

		const api = new GameServerApi()
        const embed = await api.generateEmbed(msg, game, address, await mTxServUtil.resolveLangOfMessage(msg))

		return embed
	}
};