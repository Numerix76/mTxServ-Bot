const { ApplicationCommandOptionType, EmbedBuilder, Colors } = require("discord.js");
const { Command, Constants } = require("sheweny");
const SearchAPI = require("../../api/SeachAPI");
const mTxServUtil = require("../../util/mTxServUtil");
const paginationEmbed = require("../../util/pagination");

module.exports = class SearchCommand extends Command {
	constructor(client) {
		super(client, {
			name: "search",
			nameLocalizations: {
				'fr': 'recherche'
			},
			description: "Search an article/tutorial.",
			descriptionLocalizations: {
				'fr': 'Recherche un article/turotiel.',
			},
			category: "Documentation",
			userPermissions: ["SendMessages"],
			channel: Constants.COMMAND_CHANNEL.global,
			options: [
				{
					type: ApplicationCommandOptionType.Subcommand,
					name: "mtxserv",
					nameLocalizations: {
						'fr': 'mtxserv'
					},
					description: "Search on mTxServ",
					descriptionLocalizations: {
						'fr': 'Rechercher sur mTxServ'
					},
					options: [
						{
							type: ApplicationCommandOptionType.String,
							name: "query",
							nameLocalizations: {
								'fr': 'recherche'
							},
							description: "What do you search ?",
							descriptionLocalizations: {
								'fr': 'Que recherchez vous ?'
							},
							required: true
						},
						{
							type: ApplicationCommandOptionType.String,
							name: "locale",
							nameLocalizations: {
								'fr': 'langue'
							},
							description: "The language of the article",
							descriptionLocalizations: {
								'fr': 'La langue de l\'article'
							},
							choices: [
								{
									name: "French",
									value: "fr"
								},
								 {
									name: "English",
									value: "en"
								},
								{
									name: "All",
									value: "all"
								},
							],
							required: true
						},
					]
				},
				{
					type: ApplicationCommandOptionType.Subcommand,
					name: "darkrp",
					nameLocalizations: {
						'fr': 'darkrp'
					},
					description: "Search on darkrp",
					descriptionLocalizations: {
						'fr': 'Rechercher sur darkrp'
					},
					options: [
						{
							type: ApplicationCommandOptionType.String,
							name: "query",
							nameLocalizations: {
								'fr': 'recherche'
							},
							description: "What do you search ?",
							descriptionLocalizations: {
								'fr': 'Que recherchez vous ?'
							},
							required: true
						}
					]
				},
				{
					type: ApplicationCommandOptionType.Subcommand,
					name: "glua",
					nameLocalizations: {
						'fr': 'glua'
					},
					description: "Search on glua",
					descriptionLocalizations: {
						'fr': 'Rechercher sur glua'
					},
					options: [
						{
							type: ApplicationCommandOptionType.String,
							name: "query",
							nameLocalizations: {
								'fr': 'recherche'
							},
							description: "What do you search ?",
							descriptionLocalizations: {
								'fr': 'Que recherchez vous ?'
							},
							required: true
						}
					]
				},
				{
					type: ApplicationCommandOptionType.Subcommand,
					name: "system",
					nameLocalizations: {
						'fr': 'system'
					},
					description: "Search on system",
					descriptionLocalizations: {
						'fr': 'Rechercher sur system'
					},
					options: [
						{
							type: ApplicationCommandOptionType.String,
							name: "query",
							nameLocalizations: {
								'fr': 'recherche'
							},
							description: "What do you search ?",
							descriptionLocalizations: {
								'fr': 'Que recherchez vous ?'
							},
							required: true
						}
					]
				},
				{
					type: ApplicationCommandOptionType.Subcommand,
					name: "bukkit",
					nameLocalizations: {
						'fr': 'bukkit'
					},
					description: "Search on bukkit",
					descriptionLocalizations: {
						'fr': 'Rechercher sur bukkit'
					},
					options: [
						{
							type: ApplicationCommandOptionType.String,
							name: "query",
							nameLocalizations: {
								'fr': 'recherche'
							},
							description: "What do you search ?",
							descriptionLocalizations: {
								'fr': 'Que recherchez vous ?'
							},
							required: true
						}
					]
				},
				{
					type: ApplicationCommandOptionType.Subcommand,
					name: "spigot",
					nameLocalizations: {
						'fr': 'spigot'
					},
					description: "Search on spigot",
					descriptionLocalizations: {
						'fr': 'Rechercher sur spigot'
					},
					options: [
						{
							type: ApplicationCommandOptionType.String,
							name: "query",
							nameLocalizations: {
								'fr': 'recherche'
							},
							description: "What do you search ?",
							descriptionLocalizations: {
								'fr': 'Que recherchez vous ?'
							},
							required: true
						}
					]
				}
			]
		});
	}

	async execute(interaction) {
		const website = interaction.options.getSubcommand();
		const query = interaction.options.get("query").value;
		const language = interaction.options.get("locale")?.value || "all";

		const api = new SearchAPI(website);

		let articles;

		await interaction.deferReply();
		
		try
		{
			articles = await api.search(query, language);
		} catch(e)
		{
			const response = mTxServUtil.sayError(interaction, mTxServUtil.translate(interaction, ["search", "failed"]))
			await interaction.editReply({ embeds: [response] });

			return;
		}

		if ( articles.length === 0 )
		{
			const response = mTxServUtil.sayError(interaction, mTxServUtil.translate(interaction, ["search", "no_result"]))
			await interaction.editReply({ embeds: [response] });
			
			return;
		}

		const pages = [];
		const chunkSize = 3;
		for (let i = 0; i < articles.length; i += chunkSize) {
			const chunk = articles.slice(i, i + chunkSize);

			const fields = chunk.map( article => ({ name: article.title, value: `<${article.url}>` }));

			const embed = new EmbedBuilder()
				.setTitle(mTxServUtil.translate(interaction, ["search", "success"], { "query": query }))
				.setColor(Colors.Blue)
				.addFields(fields);

			pages.push(embed);
		}

		await paginationEmbed(interaction, pages);
	}
}