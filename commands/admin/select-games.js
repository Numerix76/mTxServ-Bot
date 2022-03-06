const Discord = require('discord.js');
const mTxServUtil = require('../../util/mTxServUtil.js')

module.exports = {
	name: 'select-games',
	aliases: [],
	category: 'Admin',
	description: 'Send select games message',
	testOnly: true,
	guildOnly: true,
	permissions: ['ADMINISTRATOR'],
	hidden: false,
	slash: false,

	init: async (client) => {
		client.on('interactionCreate', async (interaction) => {
			if (!interaction.isSelectMenu()) {
				return
			}

			const { customId, values, member } = interaction

			if (customId == 'games-roles' && member instanceof Discord.GuildMember)
			{
				const lang = require(`../../languages/${await mTxServUtil.getLangOfMember(member)}.json`);
				const component = interaction.component
				const removed = component.options.filter((option) => {
					return !values.includes(option.value)
				})

				for (const id of removed) {
					member.roles.remove(id.value)
				}

				for (const id of values) {
					member.roles.add(id)
				}

				interaction.reply({
					content: lang["select-games"]["roles-update"],
					ephemeral: true
				})
			}
		})
	},

	callback: async ({ client, message, interaction, args }) => {
		const msg = message || interaction
		const langEN = require(`../../languages/en.json`);
		const langFR = require(`../../languages/fr.json`);


		const games = await client.provider.get(msg.guild.id, 'games', {})
		
		const embed = new Discord.MessageEmbed()
			.setAuthor(`${client.user.tag}`, `${client.user.displayAvatarURL()}`)
			.setColor('ORANGE')
			.addField(langEN["select-games"]["title"], langEN["select-games"]["description"])
			.addField(langFR["select-games"]["title"], langFR["select-games"]["description"])
			.setFooter(`${langEN["select-games"]["footer"]} / ${langFR["select-games"]["footer"]} - mTxServ.com`)


		if (games.length > 0)
		{
			const row = new Discord.MessageActionRow()

			let option = []

			for(const game of games)
			{
				option.push({
					label: game.name,
					emoji: game.emoji,
					value: game.role
				})
			}

			row.addComponents(
				new Discord.MessageSelectMenu()
				.setCustomId('games-roles')
				.setMinValues(0)
				.setMaxValues(games.length)
				.setPlaceholder(`${langEN["select-games"]["select"]} / ${langFR["select-games"]["select"]}`)
				.addOptions(option)
			)

			await msg.channel.send({
				embeds: [embed],
				components: [row]
			})
		}
		else
		{
			await msg.channel.send({
				embeds: [embed],
			})
		}

		msg.delete()
	}
};