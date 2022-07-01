const { Command, Constants } = require("sheweny");
const mTxServUtil = require("../../util/mTxServUtil");
const { EmbedBuilder, Colors } = require("discord.js");

module.exports = class SupportCommand extends Command {
	constructor(client) {
		super(client, {
			name: "support",
			nameLocalizations: {
				'fr': 'support'
			},
			description: "Get information about the support.",
			descriptionLocalizations: {
				'fr': 'Informations à propos du support.',
			},
			category: "mTxServ",
			userPermissions: ["SendMessages"],
			channel: Constants.COMMAND_CHANNEL.global,
		});
	}

	async execute(interaction) {
		const embed = new EmbedBuilder()
			.setTitle(mTxServUtil.translate(interaction, ["support", "title"]))
			.setDescription(mTxServUtil.translate(interaction, ["support", "description"]))
			.setColor(Colors.Blue)
			.addFields([
				{
					name: mTxServUtil.translate(interaction, ["support", "before"]),
					value: mTxServUtil.translate(interaction, ["mtxserv", "link", "help"])
				},
				{
					name: mTxServUtil.translate(interaction, ["support", "support"]),
					value: mTxServUtil.translate(interaction, ["mtxserv", "link", "support"]),
					inline: true
				},
				{
					name: mTxServUtil.translate(interaction, ["support", "create"]),
					value: mTxServUtil.translate(interaction, ["mtxserv", "link", "support_create"]),
					inline: true
				},
				{
					name: mTxServUtil.translate(interaction, ["support", "report"]),
					value: ':star:'
				}
			])

		await interaction.reply({ embeds: [embed] });
	}
}