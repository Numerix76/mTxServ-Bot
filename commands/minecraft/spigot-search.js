const Discord = require('discord.js');
const mTxServUtil = require('../../util/mTxServUtil');
const SpigotApi = require('../../api/SpigotApi')

module.exports = {
	name: 'spigot-search',
    aliases: ['spigot-plugin'],
	category: 'Minecraft',
	description: 'Search a Bukkit plugin.',
	permissions: ['SEND_MESSAGES'],
	slash: 'both',

	expectedArgs: '<query>',
	expectedArgsTypes: ['STRING'],
	
	minArgs: 1,

	callback: async ({ client, message, interaction, args }) => {
		const msg = message || interaction;
		const lang = require(`../../languages/${await mTxServUtil.resolveLangOfMessage(msg)}.json`);
		const query = args.join(" ")

		const api = new SpigotApi()
        const results = await api.search(query)

        const embed = new Discord.MessageEmbed()
            .setTitle(`:mag: ${lang['plugin_search']['search']} *${query}*`)
            .setColor('BLUE')
        ;

        if (!results.length) {
			embed
				.setColor('RED')
				.addField(lang['wiki']['no_result'], `${lang['plugin_search']['check']} <https://www.spigotmc.org/resources/categories/spigot.4/>`);
		}
		else
		{
			Object.values(results)
            .map(plugin => {
                embed.addField(`・ ${plugin.name}`, `${plugin.description_en}\n<${plugin.view_url}>` || 'n/a');
            })

			embed.fields = embed.fields.slice(0, 3);
		}

        return embed
	},
};
