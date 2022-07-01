const { Command, Constants } = require("sheweny");
const mTxServUtil = require("../../util/mTxServUtil");
const { EmbedBuilder, Colors } = require("discord.js");
const GameServerApi = require('../../api/GameServerApi')

module.exports = class ServersCommand extends Command {
	constructor(client) {
		super(client, {
			name: "servers",
			nameLocalizations: {
				'fr': 'serveurs'
			},
			description: "Consult all servers.",
			descriptionLocalizations: {
				'fr': 'Consulter tous les serveurs.',
			},
			category: "GameServer",
			userPermissions: ["SendMessages"],
			channel: Constants.COMMAND_CHANNEL.guild,
		});
	}

	async execute(interaction) {
		await interaction.deferReply();

		const gameServers = await client.provider.get(interaction.guild.id, 'servers', [])

		if (!gameServers.length) {
			const response = new EmbedBuilder()
				.setTitle(mTxServUtil.translate(interaction, ["servers", "consult", "no_result"]))
				.setDescription(mTxServUtil.translate(interaction, ["servers", "consult", "no_result_description"]))
				.setColor(Colors.Orange);

			await interaction.editReply({ embeds: [response] });

			return;
		}

		const api = new GameServerApi()

		const pages = []
		for (const gameServer of gameServers) {
			const embed = await api.generateEmbed(interaction, gameServer.game, gameServer.address);

			pages.push(embed)
		}

		await mTxServUtil.paginationEmbed(interaction, pages);
	}
}