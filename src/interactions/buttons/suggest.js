const { ModalBuilder, TextInputBuilder, ActionRowBuilder, TextInputStyle, EmbedBuilder, Colors, PermissionFlagsBits } = require("discord.js");
const { Button } = require("sheweny");
const mTxServUtil = require("../../util/mTxServUtil");

module.exports = class SuggestButton extends Button {
	constructor(client) {
		super(client, ["suggest_accepted", "suggest_refused", "suggest_implemented"]);
	}
	
	async execute(button) {
		// eslint-disable-next-line
		const { customId, values, member, message } = button

		if (!member.permissions.has(PermissionFlagsBits.Administrator))
		{
			button.reply({
				content: mTxServUtil.translate(button, ["suggest", "update", "no_access"]),
				ephemeral: true
			})

			return;
		}

		const color = { "accepted": Colors.Orange, "refused": Colors.Red, "implemented": Colors.Green }
		const embed = EmbedBuilder.from(message.embeds[0]);
		embed.setColor( color[customId.split("suggest_")[1]] );
		embed.setFields({ name: "Status", value: customId.split("suggest_")[1] })

		if ( customId.indexOf("refused") === -1 )
		{
			message.edit({ embeds: [embed] })
			
			const response = mTxServUtil.saySuccess(mTxServUtil.translate(button, ["suggest", "update", "success"]));

			await button.reply({
				embeds: [response],
				ephemeral: true
			})

			return;
		}

		const modal = new ModalBuilder()
			.setTitle(mTxServUtil.translate(button, ["suggest", "update", "title"]))
			.setCustomId('suggest-update');

		const reason = new TextInputBuilder()
			.setCustomId('tsReason')
			.setLabel(mTxServUtil.translate(button, ["suggest", "update", "tsReason"]))
			.setStyle(TextInputStyle.Paragraph)
			.setMaxLength(1024);

		const rows = [];
		for (const component of [reason]) {
			rows.push(new ActionRowBuilder().addComponents([component]));
		}

		modal.addComponents(rows);

		button.showModal(modal);
	}
};