const { Command, Constants } = require("sheweny");
const mTxServUtil = require("../../util/mTxServUtil");
const { TextInputStyle, ModalBuilder, TextInputBuilder, ActionRowBuilder } = require("discord.js");

module.exports = class SuggestCommand extends Command {
	constructor(client) {
		super(client, {
			name: "suggest",
			nameLocalizations: {
				'fr': 'suggestion'
			},
			description: "Submit a feedback.",
			descriptionLocalizations: {
				'fr': 'Propose quelque chose.',
			},
			category: "Suggest",
			userPermissions: ["SendMessages"],
			channel: Constants.COMMAND_CHANNEL.guild,
		});
	}

	async execute(interaction) {
		const currentConfig = await client.provider.get(interaction.guild.id, 'suggest-config', "")

		if (!await interaction.guild.channels.fetch(currentConfig)) {
			const response = mTxServUtil.sayError(mTxServUtil.translate(interaction, ["suggest", "create", "not_configured"]))

			await interaction.reply({ embeds: [response] });
			
			return;
		}

		const modal = new ModalBuilder()
			.setTitle(mTxServUtil.translate(interaction, ["suggest", "create", "title"]))
			.setCustomId('suggest');

		const title = new TextInputBuilder()
			.setCustomId('tsTitle')
			.setLabel(mTxServUtil.translate(interaction, ["suggest", "create", "tsTitle"]))
			.setStyle(TextInputStyle.Short)
			.setMaxLength(256);

		const description = new TextInputBuilder()
			.setCustomId('tsDescription')
			.setLabel(mTxServUtil.translate(interaction, ["suggest", "create", "tsDescription"]))
			.setStyle(TextInputStyle.Paragraph);

		const rows = [];
		for (const component of [title, description]) {
			rows.push(new ActionRowBuilder().addComponents([component]));
		}

		modal.addComponents(rows);

		interaction.showModal(modal);
	}
}