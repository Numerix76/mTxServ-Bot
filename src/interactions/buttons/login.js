const { ModalBuilder, TextInputBuilder, ActionRowBuilder, TextInputStyle, EmbedBuilder, Colors } = require("discord.js");
const { Button } = require("sheweny");
const mTxServApi = require("../../api/mTxServApi");
const mTxServUtil = require("../../util/mTxServUtil");

module.exports = class LoginButton extends Button {
	constructor(client) {
		super(client, ["btnLogin"]);
	}
	
	async execute(button) {
		const api = new mTxServApi()
		if (await api.isAuthenticated(button.user.id)) {
			const response = new EmbedBuilder()
				.setDescription(mTxServUtil.translate(button, ["account", "login", "already_connected"]))
				.setColor(Colors.Red);

			await button.reply({ embeds: [response], ephemeral: true });
			
			return;
		}

		const modal = new ModalBuilder()
			.setTitle(mTxServUtil.translate(button, ["account", "login", "title_modal"]))
			.setCustomId('login_account');

		const client_id = new TextInputBuilder()
			.setCustomId('tsClientID')
			.setLabel(mTxServUtil.translate(button, ["account", "login", "client_id_modal"]))
			.setStyle(TextInputStyle.Short);

		const client_secret = new TextInputBuilder()
			.setCustomId('tsClientSecret')
			.setLabel(mTxServUtil.translate(button, ["account", "login", "client_secret_modal"]))
			.setStyle(TextInputStyle.Short);

		const api_key = new TextInputBuilder()
			.setCustomId('tsAPIKey')
			.setLabel(mTxServUtil.translate(button, ["account", "login", "api_key_modal"]))
			.setStyle(TextInputStyle.Short);

		const rows = [];
		for (const component of [client_id, client_secret, api_key]) {
			rows.push(new ActionRowBuilder().addComponents([component]));
		}

		modal.addComponents(rows);

		button.showModal(modal);
	}
};
