const Discord = require('discord.js');


module.exports = {
	name: 'select-games',
	aliases: ['add-role', 'ajouter-jeu'],
	category: 'Admin',
	description: 'Send select games message',
	ownerOnly: true,
	guildOnly: true,
	permissions: ['SEND_MESSAGES'],
	hidden: false,
	slash: false,

	expectedArgs: '<lang>',
	expectedArgsTypes: ['STRING'],

	minArgs: 1,
	maxArgs: 1,	

	init: (client) => {
		client.on('interactionCreate', interaction => {
			if (!interaction.isSelectMenu()) {
				return
			}

			const { customId, values, member } = interaction

			if (customId == 'games-roles' && member instanceof Discord.GuildMember)
			{
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
					content:'Your roles has been updated! / Vos roles sont à jours !',
					ephemeral: true
				})
			}
		})
	},

	callback: async ({ client, message, interaction, args }) => {
		const msg = message || interaction
		const lang = require(`../../languages/${args[0]}.json`);


		const games = await client.provider.get(msg.guild.id, 'games', {})
		
		const embed = new Discord.MessageEmbed()
			.setAuthor(`${client.user.tag}`, `${client.user.displayAvatarURL()}`)
			.setColor('ORANGE')
			.addField(lang["select-games"]["title"], lang["select-games"]["description"])
			.setFooter(lang["select-games"]["footer"])


		if (games.length > 0)
		{
			const row = new Discord.MessageActionRow()

			let option = []

			for(const game of games)
			{
				option.push({
					label: game.name,
					emoji: game.emoji,
					value: args[0] === "fr"?game.roleFRID:game.roleENID
				})
			}

			row.addComponents(
				new Discord.MessageSelectMenu()
				.setCustomId('games-roles')
				.setMinValues(0)
				.setMaxValues(games.length)
				.setPlaceholder(lang["select-games"]["select"])
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