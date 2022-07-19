const { Command, Constants } = require("sheweny");
const mTxServUtil = require("../../util/mTxServUtil");
const { EmbedBuilder, Colors } = require("discord.js");

module.exports = class RanksCommand extends Command {
	constructor(client) {
		super(client, {
			name: "ranks",
			nameLocalizations: {
				'fr': 'rangs'
			},
			description: "Get the top 10 users on the discord.",
			descriptionLocalizations: {
				'fr': 'Top 10 des utilisateurs les plus actif.',
			},
			category: "mTxServ",
			userPermissions: ["SendMessages"],
			channel: Constants.COMMAND_CHANNEL.guild,
		});
	}

	async execute(interaction) {
		const topMembers = Object.values(await client.ranker.getScoresOfGuild(interaction.guild.id))
			.sort((a, b) => (a.points < b.points) ? 1 : -1 )
			.slice(0, 10)

		const pages = []
		let i = 1

		for (const userScores of topMembers) {
			const embed = new EmbedBuilder()
				.setColor(Colors.Navy);

			const user = (await interaction.guild.members.fetch(userScores.userId))?.user
			if (user) {
				embed
					.setAuthor({ name: `#${i}. ${user.username}` })
					.setThumbnail(user.avatarURL())

			} else {
				embed.setTitle(`#${i}. ${userScores.username}`)
			}

			embed.addFields([
				{
					name: mTxServUtil.translate(interaction, ["ranks", "points"]),
					value: `${userScores.points}`,
					inline: true
				},
				{
					name: mTxServUtil.translate(interaction, ["ranks", "level"]),
					value: `${userScores.level}`,
					inline: true
				},
				{
					name: mTxServUtil.translate(interaction, ["ranks", "rank"]),
					value: `${i}`,
				}
			]);

			i++
			pages.push(embed)
		}

		await mTxServUtil.paginationEmbed(interaction, pages);
	}
}