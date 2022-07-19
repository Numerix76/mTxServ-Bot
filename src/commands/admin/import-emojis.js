const { Command, Constants } = require("sheweny");
const mTxServUtil = require("../../util/mTxServUtil");
const path = require('path');
const fs = require('fs');

module.exports = class ImportEmojisCommand extends Command {
	constructor(client) {
		super(client, {
			name: "import-emojis",
			nameLocalizations: {
				'fr': 'import-emojis'
			},
			description: "Import all emojis available with the bot.",
			descriptionLocalizations: {
				'fr': 'Importe tous les émojis fournis avec le bot.',
			},
			category: "Admin",
			userPermissions: ["SendMessages", "ManageEmojisAndStickers", "UseExternalEmojis"],
			channel: Constants.COMMAND_CHANNEL.guild,
		});
	}

	async execute(interaction) {
		const emojiDirectory = path.join(__dirname, '../../emojis')
		console.log(`List emojis in directory '${emojiDirectory}'`)

		fs.readdir(emojiDirectory, (err, files) => {
			if (err) return console.error(err);

			files.forEach((file) => {
				if (file.indexOf('.png') === -1) return

				const filePath = `${emojiDirectory}/${file}`
				const emojiName = file.replace('.png', '')
				const isAlreadyAdded = interaction.guild.emojis.cache.some(emoji => emoji.name === emojiName)

				if (!isAlreadyAdded) {
					console.log(`added emoji ${filePath}`)
					interaction.guild.emojis.create({ attachment: filePath, name: emojiName }).catch(console.log)
				}
			});
		});

		const reponse = mTxServUtil.saySuccess(mTxServUtil.translate(interaction, ["import-emojis","success"]))

		await interaction.reply({
			embeds: [reponse]
		});
	}
}