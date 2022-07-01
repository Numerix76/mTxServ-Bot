
const { Command, Constants } = require("sheweny");
const mTxServUtil = require("../../util/mTxServUtil");
const { EmbedBuilder, Colors, ApplicationCommandOptionType, AttachmentBuilder } = require("discord.js");
const ConverterApi = require("../../api/ConverterApi");

module.exports = class ServersCommand extends Command {
	constructor(client) {
		super(client, {
			name: "convert",
			nameLocalizations: {
				'fr': 'convertir'
			},
			description: "Convert Youtube/SoundCloud link to mp3/mp4 files.",
			descriptionLocalizations: {
				'fr': 'Convertit des liens Youtube/Soundcloud en mp3/mp4.',
			},
			category: "Util",
			userPermissions: ["SendMessages"],
			channel: Constants.COMMAND_CHANNEL.global,
			options: [
				{
					type: ApplicationCommandOptionType.String,
					name: "url",
					nameLocalizations: {
						'fr': 'url'
					},
					description: "URL to convert",
					descriptionLocalizations: {
						'fr': 'URL à convertir'
					},
					required: true
				},
				{
					type: ApplicationCommandOptionType.String,
					name: 'format',
					nameLocalizations: {
						'fr': 'format'
					},
					description: "In which format?",
					descriptionLocalizations: {
						'fr': 'Quel format ?'
					},
					choices: [
						{
							name: "MP3",
							value: "mp3"
						},
						{
							name: "MP4",
							value: "mp4"
						},
						{
							name: "WebM",
							value: "webm"
						}
					],
					required: true
				}
			]
		});
	}

	async execute(interaction) {
		const url = interaction.options.get("url").value;
		const format = interaction.options.get("format").value;

		const embed = new EmbedBuilder()
            .setTitle(mTxServUtil.translate(interaction, ["convert", "conversion_of"], { "url": url })) //lang["convert"]["conversion_of"].replace("%url%", url))
            .setColor(Colors.Blue)
            .setTimestamp();

		await interaction.reply({ embeds: [embed] })

        const api = new ConverterApi(url, format, interaction)
		api.convert()
	}
}