const { Command, Constants } = require("sheweny");
const mTxServUtil = require("../../util/mTxServUtil");

module.exports = class ReloadCommand extends Command {
	constructor(client) {
		super(client, {
			name: "reload",
			nameLocalizations: {
				'fr': 'recharger'
			},
			description: "Reload all slashcommands.",
			descriptionLocalizations: {
				'fr': 'Recharche toutes les commandes.',
			},
			category: "Admin",
			userPermissions: ["SendMessages"],
			channel: Constants.COMMAND_CHANNEL.global,
			adminsOnly: true
		});
	}

	async execute(interaction) {
		const response = mTxServUtil.saySuccess(mTxServUtil.translate(interaction, ["reload", "success"]));

		await interaction.deferReply();

		await this.client.managers.commands.deleteAllCommands();
		await this.client.managers.commands.loadAll();
		
		await interaction.editReply({ embeds: [response] });
	}
}