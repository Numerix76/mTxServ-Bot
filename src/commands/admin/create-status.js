const { Command, Constants } = require("sheweny");
const mTxServUtil = require("../../util/mTxServUtil");

module.exports = class CreateStatusCommand extends Command {
	constructor(client) {
		super(client, {
			name: "create-status",
			nameLocalizations: {
				'fr': 'creer-statut'
			},
			description: "Add the status of mTxServ infrastrucure in the channel",
			descriptionLocalizations: {
				'fr': 'Ajoute le statut de l\'infrastruture mTxServ dans le channel',
			},
			category: "Admin",
			userPermissions: ["Administrator"],
			channel: Constants.COMMAND_CHANNEL.guild,
		});
	}

	async execute(interaction) {
		const statusMsg = await interaction.channel.send({
			content: "Waiting a refresh"
		});

		await client.provider.set('status', statusMsg.guild.id, {channel: statusMsg.channel.id, message: statusMsg.id});

		client.statusMonitor.process();

		const response = mTxServUtil.sayError(mTxServUtil.translate(interaction, ["create-status","success"]));

		await interaction.reply({
			embeds: [response],
			ephemeral: true
		});
	}
}