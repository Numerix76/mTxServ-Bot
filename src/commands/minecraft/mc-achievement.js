const { Command, Constants } = require("sheweny");
const mTxServUtil = require("../../util/mTxServUtil");
const { EmbedBuilder, Colors, ApplicationCommandOptionType, AttachmentBuilder } = require("discord.js");
const { ICONS, AchievementCreator } = require("mc-achievements");

const listIcons = Object.values(ICONS).filter(icon => typeof icon !== 'function');

module.exports = class AchievementCommand extends Command {
	constructor(client) {
		super(client, {
			name: "mc-achievement",
			nameLocalizations: {
				'fr': 'mc-succes'
			},
			description: "Create a minecraft achievement.",
			descriptionLocalizations: {
				'fr': 'Crée un succès minecraft.',
			},
			category: "Minecraft",
			userPermissions: ["SendMessages"],
			channel: Constants.COMMAND_CHANNEL.global,
			options: [
				{
					type: ApplicationCommandOptionType.String,
					name: "icon",
					nameLocalizations: {
						'fr': 'icone'
					},
					description: "Icon for the achievement",
					descriptionLocalizations: {
						'fr': 'Icone pour le succès'
					},
					autocomplete: true,
					required: true
				},
				{
					type: ApplicationCommandOptionType.String,
					name: "title",
					nameLocalizations: {
						'fr': 'titre'
					},
					description: "Title for the achievement",
					descriptionLocalizations: {
						'fr': 'Titre pour le succès'
					},
					required: true
				},
				{
					type: ApplicationCommandOptionType.String,
					name: "description",
					nameLocalizations: {
						'fr': 'description'
					},
					description: "Description for the achievement",
					descriptionLocalizations: {
						'fr': 'Description pour le succès'
					},
					required: true
				}
			]
		});
	}

	async onAutocomplete(interaction) {
		const focusedOption = interaction.options.getFocused(true);
	
		const filtered = listIcons.filter((icon) => icon.startsWith(focusedOption.value)).slice(0, 25);
		interaction.respond(filtered.map((icon) => ({ name: icon, value: icon })));
	}

	async execute(interaction) {
		const icon = interaction.options.get("icon").value;
		const title = interaction.options.get("title").value;
		const description = interaction.options.get("description").value;

		if (listIcons.indexOf(icon) === -1) {
			const response = mTxServUtil.sayError(mTxServUtil.translate(interaction, ["mc-achievement", "invalid_icon"]))

			await interaction.reply({ embeds: [response] });

			return;
		}

		try {
			const binary = await AchievementCreator.create(icon, title, description);

			const attachment = new AttachmentBuilder(binary, { name: 'achievment.png' });

			const embed = new EmbedBuilder()
				.setColor(Colors.Green)
				.setDescription(mTxServUtil.translate(interaction, ["mc-achievement", "success"]))
				.setTimestamp()
				.setImage(`attachment://achievment.png`)
				.setFooter({ text: interaction.user.tag });

			await interaction.reply({ embeds: [embed], files: [attachment] });
		} catch (err) {
			console.error(err)
			const response = mTxServUtil.sayError(mTxServUtil.translate(interaction, ["mc-achievement", "failed"], { "errMessage": err.message }));

			await interaction.reply({ embeds: [response] });
		}
	}
}