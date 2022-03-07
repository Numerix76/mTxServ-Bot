const Discord = require('discord.js');
const mTxServUtil = require('../../util/mTxServUtil.js')

module.exports = {
	name: 'select-lang',
	aliases: [],
	category: 'Admin',
	description: 'Send select language message',
	testOnly: true,
	guildOnly: true,
	permissions: ['ADMINISTRATOR'],
	hidden: true,
	slash: false,

	init: async (client) => {
		client.on('interactionCreate', async (interaction) => {
			if (!interaction.isSelectMenu()) {
				return
			}

			const { customId, values, member } = interaction

			if (customId == 'lang-roles' && member instanceof Discord.GuildMember)
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

		const iconFr = msg.guild.emojis.cache.find(emoji => emoji.name === 'fr') || ":flag_fr:";
		const iconEn = msg.guild.emojis.cache.find(emoji => emoji.name === 'en') || ":flag_us:";
		
		const embed = new Discord.MessageEmbed()
			.setAuthor(`${client.user.tag}`, `${client.user.displayAvatarURL()}`)
			.setColor('ORANGE')
			.addField(`${iconFr} Bienvenue sur mTxServ!`, `Vous parlez Français? **Cliquez sur :flag_fr:** pour activer les sections françaises.`)
			.addField(`${iconEn} Welcome on mTxServ!`, `Do you speak English? **Click :flag_us:** to see english sections.`)
			.setFooter('Choose your language / Choisissez votre langue - mTxServ.com');

		let row = new Discord.MessageActionRow()

		const option = [
			{
				label: 'Français',
				value: msg.guild.roles.cache.find(r => r.name === "FR").id,
				emoji: '🇫🇷'
			},
			{
				label: 'English',
				value: msg.guild.roles.cache.find(r => r.name === "EN").id,
				emoji: '🇺🇸'
			}
		]

		row.addComponents(
			new Discord.MessageSelectMenu()
			.setCustomId('lang-roles')
			.setMinValues(0)
			.setMaxValues(option.length)
			.setPlaceholder('Choose your language / Choisissez votre langue')
			.addOptions(option)
		)

		await msg.channel.send({
			embeds: [embed],
			components: [row]
		})

		msg.delete()
	}
};