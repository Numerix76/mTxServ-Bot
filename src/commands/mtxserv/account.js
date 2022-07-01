const { Command, Constants } = require("sheweny");
const { ApplicationCommandOptionType, ActionRowBuilder, EmbedBuilder, Colors, ButtonBuilder, ButtonStyle } = require("discord.js");
const mTxServUtil = require("../../util/mTxServUtil");
const mTxServApi = require("../../api/mTxServApi");

module.exports = class AccountCommand extends Command {
	constructor(client) {
		super(client, {
			name: "account",
			nameLocalizations: {
				'fr': 'compte'
			},
			description: "Consult, login, logout from your mTxServ account",
			descriptionLocalizations: {
				'fr': 'Consulte, connecte, déconnecte de votre compte mTxServ',
			},
			category: "mTxServ",
			userPermissions: ["SendMessages"],
			channel: Constants.COMMAND_CHANNEL.global,
			options: [
				{
					type: ApplicationCommandOptionType.Subcommand,
					name: "login",
					nameLocalizations: {
						'fr': 'connexion'
					},
					description: "Connect to your mTxServ account",
					descriptionLocalizations: {
						'fr': 'Connexion à votre compte mTxServ'
					}
				},
				{
					type: ApplicationCommandOptionType.Subcommand,
					name: "logout",
					nameLocalizations: {
						'fr': 'deconnexion'
					},
					description: "Logout from your mTxServ account",
					descriptionLocalizations: {
						'fr': 'Déconnexion de votre compte mTxServ'
					},
				},
				{
					type: ApplicationCommandOptionType.Subcommand,
					name: "profile",
					nameLocalizations: {
						'fr': 'profile'
					},
					description: "Consult your mTxServ account",
					descriptionLocalizations: {
						'fr': 'Consultez votre compte mTxServ'
					},
					options: [
						{
							type: ApplicationCommandOptionType.User,
							name: "member",
							nameLocalizations: {
								'fr': 'membre'
							},
							description: "The member you want to see more informations",
							descriptionLocalizations: {
								'fr': 'Le membre dont vous voulez voir plus d\'informations'
							},
							required: false,
						}
					]
				},
			]
		});
	}

	execute(interaction) {
		switch(interaction.options.getSubcommand())
		{
			case 'login': this.login(interaction); break;
			case 'logout': this.logout(interaction); break;
			case 'profile': this.profile(interaction); break;
		}
	}

	async login(interaction) {
		const embed = new EmbedBuilder()
			.setTitle(mTxServUtil.translate(interaction, ["account", "login", "title"]))
			.setDescription(mTxServUtil.translate(interaction, ["account", "login", "description"]))
			.setColor(Colors.Blue)
			.addFields([
				{
					name: mTxServUtil.translate(interaction, ["account", "login", "client_id_secret"]),
					value: `<${mTxServUtil.translate(interaction, ["mtxserv", "link", "oauth"])}>`
				},
				{
					name: mTxServUtil.translate(interaction, ["account", "login", "api_key"]),
					value: `<${mTxServUtil.translate(interaction, ["mtxserv", "link", "api_key"])}>`
				}
			]);

		const row = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
					.setCustomId('btnLogin')
					.setLabel(mTxServUtil.translate(interaction, ["account", "login", "button"]))
					.setStyle(ButtonStyle.Primary)
			)

		await interaction.reply({
			embeds: [embed],
			components: [row]
		})
	}

	async logout(interaction) {
		const api = new mTxServApi()
		const isAuthenticated = await api.isAuthenticated(interaction.user.id)

		if (!isAuthenticated) {
			const response =  mTxServUtil.sayError(mTxServUtil.translate(interaction, ["account", "not_logged"]));

			await interaction.reply({ embeds: [response] });

			return;
		}

		await api.logout(interaction.user.id);

	   	const response = mTxServUtil.saySuccess(mTxServUtil.translate(interaction, ["account", "logout", "success"]));

		await interaction.reply({ embeds: [response] });
	}

	async profile(interaction) {
		await interaction.deferReply();

		const user = interaction.options.getUser("member") || interaction.user;

		const userScores = await client.ranker.getScoresOfUser(interaction.guild.id, user, true)
		const embed = new EmbedBuilder()
			.setThumbnail(user.avatarURL())
			.setColor(Colors.Navy);

		// me
		const api = new mTxServApi()
		let isAuthenticated = await api.isAuthenticated(user.id)
		let profile = {
			about: false,
			is_admin: false,
			discord_url: null,
			facebook_url: null,
			twitter_url: null,
			youtube_url: null,
			instagram_url: null,
			twitch_url: null,
			website_url: null,
			workshop_url: null,
			tutorial_add_link: null,
			tutorials: [],
			countGameServers: 0,
			countVoiceServers: 0,
			countWebHosting: 0,
			countVps: 0
		}

		if (isAuthenticated) {
			try {
				const oauth = await api.loginFromCredentials(user.id)
				profile = await api.call(oauth['access_token'], 'user/me')
				const invoices = await api.call(oauth['access_token'], 'invoices')

				profile.countGameServers = invoices.filter(invoice => invoice.type_id === 1).length
				profile.countVoiceServers = invoices.filter(invoice => invoice.type_id === 2).length
				profile.countWebHosting = invoices.filter(invoice => invoice.type_id === 3).length
				profile.countVps = invoices.filter(invoice => invoice.type_id === 5).length

				isAuthenticated = true
			} catch(err) {
				isAuthenticated = false
				console.error(err)
			}
		}

		// scores
		const allMembers = Object.values(await client.ranker.getScoresOfGuild(interaction.guild.id))

		const filteredMembers = allMembers
			.filter(scores => scores.points >= userScores.points)

		embed.setAuthor({ name: mTxServUtil.translate(interaction, ["account", "profile", "author"], { "username": user.username }), url: profile.website_url })
		embed.addFields([
			{
				name: mTxServUtil.translate(interaction, ["account", "profile", "points"]),
				value: `${userScores.points}`,
				inline: true
			},
			{
				name: mTxServUtil.translate(interaction, ["account", "profile", "level"]),
				value: `${userScores.level}`,
				inline: true
			},
			{
				name: mTxServUtil.translate(interaction, ["account", "profile", "rank"]),
				value: `${filteredMembers.length}`,
				inline: true
			},
			{
				name: mTxServUtil.translate(interaction, ["account", "profile", "linked"]),
				value: isAuthenticated ? '✓':'✗',
				inline: true
			},
			{
				name: mTxServUtil.translate(interaction, ["account", "profile", "game_servers"]),
				value: `${profile.countGameServers}`,
				inline: true
			},
			{
				name: mTxServUtil.translate(interaction, ["account", "profile", "voice_servers"]),
				value: `${profile.countVoiceServers}`,
				inline: true
			},
			{
				name: mTxServUtil.translate(interaction, ["account", "profile", "web_hosting"]),
				value: `${profile.countWebHosting}`,
				inline: true
			},
			{
				name: mTxServUtil.translate(interaction, ["account", "profile", "vps"]),
				value: `${profile.countVps}`,
				inline: true
			}
		]);

		if (isAuthenticated)
		{
			let description = profile.about || ''
	
			if (profile.tutorials?.length) {
				description += `\n\n${mTxServUtil.translate(interaction, ["account", "profile", "latest_tutos"], { "username": user.username})} ([${mTxServUtil.translate(interaction, ["account", "profile", "how_to_tutorial"])}](${mTxServUtil.translate(interaction, ["mtxserv", "link", "create_tutorial"])}))`
	
				for (const tutorial of profile.tutorials) {
					description += `\n✓ [${tutorial.title}](${tutorial.link})`
				}
			}
	
			description = profile.about ? description : description + `\n\n[${mTxServUtil.translate(interaction, ["account", "profile", "edit"])}](${mTxServUtil.translate(interaction, ["mtxserv", "link", "profile"])})`
	
			embed.setDescription(description)
		}

		if (profile.is_admin) {
			embed.setFooter({ text: mTxServUtil.translate(interaction, ["account", "profile", "is_admin"], { "username": user.username})})
		}

		if (profile.website_url) {
			embed.addFields({ name: mTxServUtil.translate(interaction, ["account", "profile", "website"]), value: `[${mTxServUtil.translate(interaction, ["account", "profile", "visit_website"])}](${profile.website_url})`, inline: true })
		}

		if (profile.workshop_url) {
			embed.addFields({ name: `Workshop`, value: `[STEAM Workshop](${profile.workshop_url})`, inline: true })
		}

		if (profile.discord_url) {
			embed.addFields({ name: `Discord`, value: `[${mTxServUtil.translate(interaction, ["account", "profile", "join_discord"])}](${profile.discord_url})`, inline: true })
		}

		if (profile.twitter_url) {
			embed.addFields({ name: `Twitter`, value: `[Twitter](${profile.twitter_url})`, inline: true })
		}

		if (profile.youtube_url) {
			embed.addFields({ name: `Youtube`, value: `[Youtube](${profile.youtube_url})`, inline: true })
		}

		if (profile.twitch_url) {
			embed.addFields({ name: `Twitch`, value: `[Twitch](${profile.twitch_url})`, inline: true })
		}

		if (profile.facebook_url) {
			embed.addFields({ name: `Facebook`, value: `[Facebook](${profile.facebook_url})`, inline: true })
		}

		await interaction.editReply({ embeds: [embed] });
	}
};