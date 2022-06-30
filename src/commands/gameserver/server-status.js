
const { Command, Constants } = require("sheweny");
const mTxServUtil = require("../../util/mTxServUtil");
const { EmbedBuilder, Colors, ApplicationCommandOptionType } = require("discord.js");
const GameServerApi = require('../../api/GameServerApi')

module.exports = class ServerStatusCommand extends Command {
	constructor(client) {
		super(client, {
			name: "server-status",
			nameLocalizations: {
				'fr': 'serveur-statut'
			},
			description: "Check the status of a server.",
			descriptionLocalizations: {
				'fr': 'Regarder l\'état d\'un serveur.',
			},
			category: "GameServer",
			userPermissions: ["SendMessages"],
			channel: Constants.COMMAND_CHANNEL.global,
			options: [
				{
					name: 'game',
					nameLocalizations: {
						'fr': 'jeu'
					},
					description: 'The server is running which game?',
					descriptionLocalizations: {
						'fr': 'Le serveur est sur quel jeu ?'
					},
					type: ApplicationCommandOptionType.String,
					choices: [
						{
							name: "Minecraft",
							value: "minecraft"
						},
						{
							name: "Garry's Mod",
							value: "gmod"
						},
						{
							name: "Ark",
							value: "ark"
						},
						{
							name: "Rust",
							value: "rust"
						},
						{
							name: "Onset",
							value: "onset"
						},
						{
							name: "Arma 3",
							value: "arma3"
						},
						{
							name: "Valheim",
							value: "valheim"
						},
					],
					required: true
				},
				{
					name: 'address',
					nameLocalizations: {
						'fr': 'adresse'
					},
					description: 'Address of server (eg: game.fr.01.mtxserv.com:27030)',
					descriptionLocalizations: {
						'fr': 'Adresse du serveur (ex: game.fr.01.mtxserv.com:27030)'
					},
					type: ApplicationCommandOptionType.String,
					required: true,
				}
			]
		});
	}

	async execute(interaction) {
		await interaction.deferReply();

		const game = interaction.options.get("game").value;
		const address = interaction.options.get("address").value;

		const api = new GameServerApi()
        const embed = await api.generateEmbed(interaction, game, address)

		await interaction.editReply({ embeds: [embed] });
	}
}