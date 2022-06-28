const { Command, Constants } = require("sheweny");
const mTxServUtil = require("../../util/mTxServUtil");
const { EmbedBuilder, Colors, ActionRowBuilder, SelectMenuBuilder } = require("discord.js");

module.exports = class LangSelectorCommand extends Command {
	constructor(client) {
		super(client, {
			name: "lang-selector",
			nameLocalizations: {
				'fr': 'select-lang'
			},
			description: "Create a language selector.",
			descriptionLocalizations: {
				'fr': 'Créer un message pour sélectionner une langue.',
			},
			category: "Admin",
			userPermissions: ["Administrator"],
			channel: Constants.COMMAND_CHANNEL.guild,
		});
	}

	async execute(interaction) {	
		const embed = new EmbedBuilder()
			.setAuthor({ name: client.user.tag, iconURL: client.user.displayAvatarURL() })
			.setColor(Colors.Orange)
			.addFields([
				{
					name: ":flag_fr: Bienvenue sur mTxServ!",
					value: "Vous parlez Français? **Cliquez sur :flag_fr:** pour activer les sections françaises."
				},
				{
					name: ":flag_us: Welcome on mTxServ!",
					value: "Do you speak English? **Click :flag_us:** to see english sections."
				}
			])
			.setFooter({ text: 'Choose your language / Choisissez votre langue - mTxServ.com' });

		let row = new ActionRowBuilder()

		const option = [
			{
				label: 'Français',
				value: interaction.guild.roles.cache.find(r => r.name.toLowerCase() === "fr").id,
				emoji: '🇫🇷'
			},
			{
				label: 'English',
				value: interaction.guild.roles.cache.find(r => r.name.toLowerCase() === "en").id,
				emoji: '🇺🇸'
			}
		]

		row.addComponents(
			new SelectMenuBuilder()
			.setCustomId('lang-selector')
			.setMinValues(0)
			.setMaxValues(option.length)
			.setPlaceholder('Choose your language / Choisissez votre langue')
			.addOptions(option)
		)

		await interaction.channel.send({
			embeds: [embed],
			components: [row]
		})

		const reponse = mTxServUtil.saySuccess(mTxServUtil.translate(interaction, ["lang-selector","success"]))

		await interaction.reply({
			embeds: [reponse],
			ephemeral: true
		});
	}
}