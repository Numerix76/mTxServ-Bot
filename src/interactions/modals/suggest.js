const { EmbedBuilder, Colors, ActionRowBuilder, ButtonBuilder, ButtonStyle, Utils } = require("discord.js");
const { Modal } = require("sheweny");
const mTxServUtil = require("../../util/mTxServUtil");

module.exports = class SuggestModal extends Modal {
	constructor(client) {
		super(client, ['suggest']);
	}

	async execute(modal) {
		const title = modal.fields.getTextInputValue("tsTitle");
		const description = modal.fields.getTextInputValue("tsDescription");

		const currentConfig = await client.provider.get(modal.guild.id, 'suggest-config', "")

		const embed = new EmbedBuilder()
			.setAuthor({ name: modal.user.tag, iconURL: modal.user.displayAvatarURL() })
			.setColor(Colors.DarkBlue)
			.setTitle(title)
			.setDescription(description.trim())
			.addFields({ name: 'Status', value: `waiting` })
			.setTimestamp();

		const row = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
					.setCustomId('suggest_accepted')
					.setLabel("Accept")
					.setStyle(ButtonStyle.Primary)
			)
			.addComponents(
				new ButtonBuilder()
					.setCustomId('suggest_refused')
					.setLabel("Refuse")
					.setStyle(ButtonStyle.Danger)
			)
			.addComponents(
				new ButtonBuilder()
					.setCustomId('suggest_implemented')
					.setLabel("Implemente")
					.setStyle(ButtonStyle.Success)
			)

		const suggestChannel = await modal.guild.channels.fetch(currentConfig);
		
		const resMes = await suggestChannel.send({ 
				embeds: [embed],
				components: [row]
			})
		;

		resMes.startThread({ name: `Suggestion of ${modal.user.tag}` })

		const response = mTxServUtil.saySuccess(mTxServUtil.translate(modal, ["suggest", "create", "success"], { "name": modal.user.username }));

		await modal.reply({ embeds: [response] });
	}
}