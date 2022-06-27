const { Command, Constants } = require("sheweny");
const { ApplicationCommandOptionType, ActionRowBuilder, SelectMenuBuilder, SelectMenuComponent, EmbedBuilder, Colors } = require("discord.js");
const mTxServUtil = require("../../util/mTxServUtil");

module.exports = class AddGameCommand extends Command {
	constructor(client) {
		super(client, {
			name: "game-selector",
			nameLocalizations: {
				'fr': 'selection-jeu'
			},
			description: "Add or Remove role from the game selector",
			descriptionLocalizations: {
				'fr': 'Ajoute ou Retire un rôle dans la selection de jeu',
			},
			category: "Admin",
			userPermissions: ["Administrator"],
			channel: Constants.COMMAND_CHANNEL.guild,
			adminsOnly: true,
			options: [
				{
					type: ApplicationCommandOptionType.Subcommand,
					name: "add",
					nameLocalizations: {
						'fr': 'ajouter'
					},
					description: "Add a game",
					descriptionLocalizations: {
						'fr': 'Ajouter un jeu'
					},
					options: [
						{
							type: ApplicationCommandOptionType.String,
							name: "game",
							nameLocalizations: {
								'fr': 'jeu'
							},
							description: "The game to be added",
							descriptionLocalizations: {
								'fr': 'Le jeu à ajouter'
							},
							required: true
						},
						{
							type: ApplicationCommandOptionType.String,
							name: "emoji",
							nameLocalizations: {
								'fr': 'emoji'
							},
							description: "The emoji for the game",
							descriptionLocalizations: {
								'fr': 'L\'émoji pour le jeu'
							},
							required: true
						},
						{
							type: ApplicationCommandOptionType.Role,
							name: "role",
							nameLocalizations: {
								'fr': 'role'
							},
							description: "The role for the game",
							descriptionLocalizations: {
								'fr': 'Le role pour le jeu'
							},
							required: true
						}
					]
				},
				{
					type: ApplicationCommandOptionType.Subcommand,
					name: "remove",
					nameLocalizations: {
						'fr': 'retirer'
					},
					description: "Remove a game",
					descriptionLocalizations: {
						'fr': 'Retirer un jeu'
					},
					options: [
						{
							type: ApplicationCommandOptionType.String,
							name: "game",
							nameLocalizations: {
								'fr': 'jeu'
							},
							description: "The game to be removed",
							descriptionLocalizations: {
								'fr': 'Le jeu à retirer'
							},
							required: true
						}
					]
				},
				{
					type: ApplicationCommandOptionType.Subcommand,
					name: "create",
					nameLocalizations: {
						'fr': 'creer'
					},
					description: "Create the selector",
					descriptionLocalizations: {
						'fr': 'Crée le message de sélection'
					}
				}
			]
		});
	}

	execute(interaction) {
		switch(interaction.options.getSubcommand())
		{
			case 'add': this.addGame(interaction); break;
			case 'remove': this.removeGame(interaction); break;
			case 'create': this.create(interaction); break;
		}
	}

	async addGame(interaction) {	
		const game  = interaction.options.get("game").value;
		const emoji = interaction.options.get("emoji").value;
		const role  = interaction.options.getRole("role").id;
		
		const regexDefaultEmoji = /^\p{Extended_Pictographic}$/gu;
		const regexCustomEmoji = /^<:.+?:\d+>$/g;
		if ( !emoji.match(regexDefaultEmoji) && (!emoji.match(regexCustomEmoji) || client.emojis.cache.get( emoji.match(/\d+/g) )) )
		{
			const response = mTxServUtil.sayError(interaction, mTxServUtil.translate(interaction, ["game-selector","add","invalid_emoji"]));
			await interaction.reply({ embeds: [response] });

			return;
		}

		const games = await client.provider.get(interaction.guild.id, 'games', [])

		for(const game of games)
		{
			if (game.role === role)
			{
				const response = mTxServUtil.sayError(interaction, mTxServUtil.translate(interaction, ["game-selector","add","role_already_exist"]));
				await interaction.reply({ embeds: [response] });

				return;
			}
		}

		games.push({
			name: game,
			emoji: emoji,
			role: role
		})

		const options = new Array();

		for(const game of games)
		{
			options.push({
				label: game.name,
				emoji: game.emoji,
				value: game.role
			})
		}
		
		if ( this.updateSelection(interaction, options) )
		{
			const response = mTxServUtil.saySuccess(interaction, mTxServUtil.translate(interaction, ["game-selector","add","success"], {"%game%": game, "%emoji%": emoji}));
			
			await interaction.reply({ embeds: [response] });
			
			await client.provider.set(interaction.guild.id, 'games', games);
		}
		else
		{
			const response = mTxServUtil.sayError(interaction, mTxServUtil.translate(interaction, ["game-selector","missing_message"])); 
			
			await interaction.reply({ embeds: [response] });
		}
	}

	async removeGame(interaction)
	{
		const game = interaction.options.get("game").value;

		let games = await client.provider.get(interaction.guild.id, 'games', [])

		games = games.filter((item) => {
			return item.name !== game
		})

		const options = new Array();

		for(const game of games)
		{
			options.push({
				label: game.name,
				emoji: game.emoji,
				value: game.role
			})
		}
		
		if ( await this.updateSelection(interaction, options) )
		{
			const response = mTxServUtil.saySuccess(interaction, mTxServUtil.translate(interaction, ["game-selector","remove","success"], {"%game%": game}));

			await interaction.reply({ embeds: [response] });
			await client.provider.set(interaction.guild.id, 'games', games);
		}
		else
		{
			const response = mTxServUtil.sayError(interaction, mTxServUtil.translate(interaction, ["game-selector","missing_message"]));
			
			await interaction.reply({ embeds: [response] });
		}
	}

	async updateSelection(interaction, options)
	{
		let currentConfig;
		let gamesChannel;
		let gamesMessage;

		try
		{
			currentConfig = await client.provider.get(interaction.guild.id, 'select-games', {});
			gamesChannel = await interaction.guild.channels.fetch(currentConfig.channel);
			gamesMessage = await gamesChannel?.messages.fetch({ message: currentConfig.message });
		} catch(error) {}

		if ( !gamesMessage )
			return false;

		const row = new ActionRowBuilder();

		row.addComponents(
			new SelectMenuBuilder()
				.setCustomId('game-selector')
				.setMinValues(0)
				.setMaxValues(options.length)
				.setPlaceholder("Choose your roles / Choisissez vos roles")
				.addOptions(options)
		)

		gamesMessage.edit({
			components: [row]
		})

		return true;
	}

	async create(interaction)
	{
		const embed = new EmbedBuilder()
			.setAuthor({ name: client.user.tag, iconURL: client.user.displayAvatarURL() })
			.setColor(Colors.Orange)
			.addFields([
				{
					name: "🇺🇸 Select your games",
					value: "Select the games that interest you **to see related channels**."
				},
				{
					name: "🇫🇷 Selectionnez vos jeux",
					value: "Sélectionnez les jeux qui vous interessent **pour voir les channels dédiés**"
				}
			])
			.setFooter({ text: "Choose your games / Choisissez vos jeux - mTxServ.com" });

		const games = await client.provider.get(interaction.guild.id, 'games', [])

		const options = new Array();

		for(const game of games)
		{
			options.push({
				label: game.name,
				emoji: game.emoji,
				value: game.role
			})
		}
		
		const message = await interaction.channel.send({ embeds: [embed]});
			
		client.provider.set(interaction.guild.id, 'select-games', {channel: message.channel.id, message: message.id});

		await this.updateSelection(interaction, options);

		const response = mTxServUtil.saySuccess(interaction, mTxServUtil.translate(interaction, ["game-selector","create","success"]));

		await interaction.reply({
			embeds: [response],
			ephemeral: true,
		})
	}
};