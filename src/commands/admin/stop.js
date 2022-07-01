const { Command, Constants } = require("sheweny");
const mTxServUtil = require("../../util/mTxServUtil");
const { EmbedBuilder, Colors } = require("discord.js");

module.exports = class StopCommand extends Command {
	constructor(client) {
		super(client, {
			name: "stop-bot",
			nameLocalizations: {
				'fr': 'stop-bot'
			},
			description: "Shutdown the bot.",
			descriptionLocalizations: {
				'fr': 'Arrête le bot.',
			},
			category: "Admin",
			userPermissions: ["SendMessages"],
			channel: Constants.COMMAND_CHANNEL.global,
			adminsOnly: true
		});
	}

	async execute(interaction) {	
		const embed = new EmbedBuilder()
			.setAuthor({ name: client.user.tag, iconURL: client.user.displayAvatarURL() })
			.setColor(Colors.Red)
			.setTitle(':red_circle: Bot is offline')
			.setTimestamp();

		await mTxServUtil.sendLogMessage({
			embeds: [embed]
		});

		const response = mTxServUtil.sayError(mTxServUtil.translate(interaction, ["stop-bot","success"]))

		await interaction.reply({
			embeds: [response]
		});
		
		process.exit();
	}
}