const { EmbedBuilder, Colors } = require("discord.js");
const { Modal } = require("sheweny");
const mTxServUtil = require("../../util/mTxServUtil");

module.exports = class SuggestUpdateModal extends Modal {
	constructor(client) {
		super(client, ['suggest-update']);
	}

	async execute(modal) {
		const { customId, values, member, message } = modal;

		const reason = modal.fields.getTextInputValue("tsReason");

		const embed = EmbedBuilder.from(message.embeds[0]);
		embed.setColor( Colors.Red );
		embed.setFields([
			{ name: "Status", value: "refused" },
			{ name: "Reason", value: reason}
		])

		message.edit({ embeds: [embed] })

		const response = mTxServUtil.saySuccess(mTxServUtil.translate(modal, ["suggest", "update", "success"]));

		await modal.reply({
			embeds: [response],
			ephemeral: true
		})
	}
}