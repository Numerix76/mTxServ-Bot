const { Modal } = require("sheweny");
const mTxServApi = require("../../api/mTxServApi");
const mTxServUtil = require("../../util/mTxServUtil");

module.exports = class Mod extends Modal {
	constructor(client) {
		super(client, ['login_account']);
	}
	async execute(modal) {
		const api = new mTxServApi();

		const client_id = modal.fields.getTextInputValue("tsClientID");
		const client_secret = modal.fields.getTextInputValue("tsClientSecret");
		const api_key = modal.fields.getTextInputValue("tsAPIKey");

		try {
			await api.login(client_id, client_secret, api_key);
			
			api.setCredential(modal.user.id, {
				clientId: client_id,
				clientSecret: client_secret,
				apiKey: api_key
			})

			const response = mTxServUtil.saySuccess(mTxServUtil.translate(modal, ["account", "login", "success"]));

			await modal.reply({ embeds: [response], ephemeral: true });
		} catch (err) {
			console.error(err)

			const response = mTxServUtil.sayError(mTxServUtil.translate(modal, ["account", "login", "failed"]));

			await modal.reply({ embeds: [response], ephemeral: true });
		}
	}
}