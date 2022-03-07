const Discord = require('discord.js');
const mTxServUtil = require('../../util/mTxServUtil');
const GameSoftwareApi = require('../../api/GameSoftwareApi');

module.exports = {
	name: 'mc-api',
    aliases: [],
	category: 'Minecraft',
	description: 'Show information about a minecraft api.',
	permissions: ['SEND_MESSAGES'],
	slash: 'both',

	expectedArgs: "<api>",
	expectedArgsTypes: ['STRING'],

	minArgs: 1,
	maxArgs: 1,

	options: [
		{
		  name: 'api',
		  description: 'Which api do you want to have more information?',
		  required: true,
		  type: 'STRING',
		  choices: [
				{
					name: "Bukkit",
					value: "bukkit"
				},
			 	{
					name: "Fabric",
					value: "fabric"
				},
				{
					name: "Forge",
					value: "forge"
				},
				{
					name: "Magma",
					value: "magma"
				},
				{
					name: "Mohist",
					value: "mohist"
				},
				{
					name: "Paper",
					value: "paper"
				},
				{
					name: "Snapshot",
					value: "snapshot"
				},
				{
					name: "Spigot",
					value: "spigot"
				},
				{
					name: "Vanilla",
					value: "vanilla"
				},
		  ]
		}
	],

	callback: async ({ client, message, interaction, args }) => {
		const msg = message || interaction;
		const userLang = await mTxServUtil.resolveLangOfMessage(msg);
		const lang = require(`../../languages/${userLang}.json`);
		const baseUrl = userLang == 'fr' ? 'https://mtxserv.com/fr/minecraft-versions': 'https://mtxserv.com/minecraft-versions';
		
		const apis = ['bukkit', 'fabric', 'forge', 'magma', 'mohist', 'paper', 'snapshot', 'spigot', 'vanilla']
		
		const [api] = args

		if (apis.indexOf(api) === -1) {
			return mTxServUtil.sayError(msg, lang["software_search"]["invalid_api"])
		}

        const softwareAPI = new GameSoftwareApi()
        const results = await softwareAPI.search('minecraft', api)
        const softwares = Object.values(results);

		let embed = new Discord.MessageEmbed();
		if (!softwares.length) {
        	embed.setTitle(`:mag: ${lang['software_search']['search']} *${query}*`)
            embed.setColor('RED')
            embed.addField(lang['software_search']['no_result'], `${lang['how_to']['check']} <${baseUrl}>`)
		}
		else {
			embed = softwareAPI.generateSoftwareEmbed(softwares[0], userLang, baseUrl)
		}

        return embed;
    }
};
