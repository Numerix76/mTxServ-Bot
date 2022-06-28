const { Command, Constants } = require("sheweny");
const mTxServUtil = require("../../util/mTxServUtil");
const { EmbedBuilder, Colors } = require("discord.js");
const { execSync } = require('child_process');

module.exports = class LangSelectorCommand extends Command {
	constructor(client) {
		super(client, {
			name: "update-bot",
			nameLocalizations: {
				'fr': 'update-bot'
			},
			description: "Update the bot.",
			descriptionLocalizations: {
				'fr': 'Met à jour le bot.',
			},
			category: "Admin",
			userPermissions: ["SendMessages"],
			channel: Constants.COMMAND_CHANNEL.guild,
			adminsOnly: true
		});
	}

	async execute(interaction) {
		const response = mTxServUtil.sayWarning(mTxServUtil.translate(interaction, ["update-bot", "confirm"]));
		
		await interaction.reply({ embeds: [response] });

		const results = this.exec('git pull && npm install --silent');

		const embed = new EmbedBuilder()
			.setAuthor({ name: client.user.tag, iconURL: client.user.displayAvatarURL() })
			.setColor(results.err ? Colors.Red : Colors.Green)
			.setTitle(mTxServUtil.translate(interaction, ["update-bot", results.err ? "fail" : "success"]))
			.setDescription(`\`\`\`sh\n${results.std}\n\`\`\``)
			.setTimestamp();

		if ( interaction.channel.id !== this.client.logChannel )
			await mTxServUtil.sendLogMessage({ embeds: [embed] });

		await interaction.editReply({embeds : [embed]});
	}

	exec(command) {
		try {
			const stdout = execSync(command, { timeout: 30000, encoding: 'utf8' });
			return { err: false, std: stdout.trim() };
		} catch (err) {
			return { err: true, std: err.stderr.trim() };
		}
	}
}