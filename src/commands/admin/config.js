const { Command, Constants } = require("sheweny");
const { ApplicationCommandOptionType, ActionRowBuilder, SelectMenuBuilder, EmbedBuilder, Colors, ChannelType } = require("discord.js");
const mTxServUtil = require("../../util/mTxServUtil");
const mTxServApi = require("../../api/mTxServApi");
const GameServerApi = require("../../api/GameServerApi");

const gamesChoice = [
	{
		name: "Minecraft",
		value: "minecraft"
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
		name: "Garry's Mod",
		value: "gmod"
	},
	{
		name: "S&box",
		value: "sandbox"
	},
	{
		name: "Hytale",
		value: "hytale"
	},
	{
		name: "CS:GO",
		value: "csgo"
	},
	{
		name: "Valorant",
		value: "valorant"
	},
	{
		name: "League Of Legends",
		value: "lol"
	},
	{
		name: "Overwatch",
		value: "overwatch"
	},
	{
		name: "Fortnite",
		value: "fortnite"
	},
	{
		name: "Rocket League",
		value: "rocketleague"
	},
	{
		name: "Web",
		value: "web"
	},
	{
		name: "Film",
		value: "film"
	},
	{
		name: "Science",
		value: "science"
	},
];

module.exports = class ConfigCommand extends Command {
	constructor(client) {
		super(client, {
			name: "config",
			nameLocalizations: {
				'fr': 'config'
			},
			description: "Config the bot",
			descriptionLocalizations: {
				'fr': 'Configure the bot',
			},
			category: "Admin",
			userPermissions: ["Administrator"],
			channel: Constants.COMMAND_CHANNEL.guild,
			options: [
				{
					type: ApplicationCommandOptionType.SubcommandGroup,
					name: "servers",
					nameLocalizations: {
						'fr': 'serveurs'
					},
					description: "Add or Remove a server",
					descriptionLocalizations: {
						'fr': 'Ajoute ou Retire un serveur'
					},
					options: [
						{
							type: ApplicationCommandOptionType.Subcommand,
							name: "add",
							nameLocalizations: {
								'fr': 'ajouter'
							},
							description: "Add a server",
							descriptionLocalizations: {
								'fr': 'Ajouter un serveur'
							}
						},
						{
							type: ApplicationCommandOptionType.Subcommand,
							name: "remove",
							nameLocalizations: {
								'fr': 'retirer'
							},
							description: "Remove a server",
							descriptionLocalizations: {
								'fr': 'Retirer un serveur'
							},
						},
						{
							type: ApplicationCommandOptionType.Subcommand,
							name: "reset",
							nameLocalizations: {
								'fr': 'reinitialiser'
							},
							description: "Remove all registered servers on the Discord server",
							descriptionLocalizations: {
								'fr': 'Retire tous les serveurs enregistré sur le serveur Discord'
							},
						},
					]
				},
				{
					type: ApplicationCommandOptionType.SubcommandGroup,
					name: "game-selector",
					nameLocalizations: {
						'fr': 'selection-jeu'
					},
					description: "Add or Remove role from the game selector",
					descriptionLocalizations: {
						'fr': 'Ajoute ou Retire un rôle dans la selection de jeu'
					},
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
									required: true,
									autocomplete: true
								}
							]
						},
						{
							type: ApplicationCommandOptionType.Subcommand,
							name: "create",
							nameLocalizations: {
								'fr': 'creer-statut'
							},
							description: "Create the selector",
							descriptionLocalizations: {
								'fr': 'Crée le message de sélection'
							}
						}
					]
				},
				{
					type: ApplicationCommandOptionType.SubcommandGroup,
					name: "feeds",
					nameLocalizations: {
						'fr': 'feeds'
					},
					description: "Add or Remove a feed",
					descriptionLocalizations: {
						'fr': 'Ajoute ou Retire un feed'
					},
					options: [
						{
							type: ApplicationCommandOptionType.Subcommand,
							name: "add",
							nameLocalizations: {
								'fr': 'ajouter'
							},
							description: "Add a feed",
							descriptionLocalizations: {
								'fr': 'Ajoute un feed'
							},
							options: [
								{
									type: ApplicationCommandOptionType.String,
									name: 'game',
									nameLocalizations: {
										'fr': 'jeu'
									},
									description: 'Which game do you want to follow?',
									descriptionLocalizations: {
										'fr': 'Quel jeu voulez-vous suivre ?'
									},
									required: true,
									choices: gamesChoice
								},
								{
									type: ApplicationCommandOptionType.Channel,
									channelTypes: [ChannelType.GuildText, ChannelType.GuildNews],
									name: 'channel',
									nameLocalizations: {
										'fr': 'salon'
									},
									description: 'In which channel do you want to post new articles?',
									descriptionLocalizations: {
										'fr': 'Dans quel salon voulez-vous afficher les articles ?'
									},
									required: true,
								},
								{
									type: ApplicationCommandOptionType.String,
									name: 'locale',
									nameLocalizations: {
										'fr': 'langue'
									},
									description: 'Which language?',
									descriptionLocalizations: {
										'fr': 'Quel langage ?'
									},
									required: true,
									choices: [
										{
											name: "Français",
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
									]
								},
							]
						},
						{
							type: ApplicationCommandOptionType.Subcommand,
							name: "remove",
							nameLocalizations: {
								'fr': 'retirer'
							},
							description: "Unsubscribe to a feed.",
							descriptionLocalizations: {
								'fr': 'Se désabonner d\'un feed'
							},
							options: [
								{
									type: ApplicationCommandOptionType.String,
									name: 'game',
									nameLocalizations: {
										'fr': 'jeu'
									},
									description: 'Which game do you want to unfollow?',
									descriptionLocalizations: {
										'fr': 'Quel jeu ne voulez-vous plus suivre ?'
									},
									required: true,
									choices: gamesChoice
								}
							]
						}
					]
				},
				{
					type: ApplicationCommandOptionType.Subcommand,
					name: "create-status",
					nameLocalizations: {
						'fr': 'creer-statut'
					},
					description: "Add the status of mTxServ infrastrucure in the channel",
					descriptionLocalizations: {
						'fr': 'Ajoute le statut de l\'infrastruture mTxServ dans le channel'
					},
					options: [
						{
							type: ApplicationCommandOptionType.Channel,
							channelTypes: [ChannelType.GuildText],
							name: 'channel',
							nameLocalizations: {
								'fr': 'salon'
							},
							description: 'Which channel for the status?',
							descriptionLocalizations: {
								'fr': 'Quel channel pour le statut ?'
							},
							required: true,
						},
					],
				},
				{
					type: ApplicationCommandOptionType.Subcommand,
					name: "suggest",
					nameLocalizations: {
						'fr': 'suggestion'
					},
					description: "Set the suggestion channel",
					descriptionLocalizations: {
						'fr': 'Change le channel de suggestion'
					},
					options: [
						{
							type: ApplicationCommandOptionType.Channel,
							channelTypes: [ChannelType.GuildText],
							name: 'channel',
							nameLocalizations: {
								'fr': 'salon'
							},
							description: 'Which channel used to post suggestion?',
							descriptionLocalizations: {
								'fr': 'Quel channel utilisez pour les suggestions ?'
							},
							required: true,
						},
					],
				},
				{
					type: ApplicationCommandOptionType.Subcommand,
					name: "lang-selector",
					nameLocalizations: {
						'fr': 'select-lang'
					},
					description: "Create a language selector.",
					descriptionLocalizations: {
						'fr': 'Créer un message pour sélectionner une langue.',
					},
					options: [
						{
							type: ApplicationCommandOptionType.Channel,
							channelTypes: [ChannelType.GuildText],
							name: 'channel',
							nameLocalizations: {
								'fr': 'salon'
							},
							description: 'Which channel for selecting language?',
							descriptionLocalizations: {
								'fr': 'Quel channel pour choisir la langue ?'
							},
							required: true,
						},
					],
				}
			]
		});
	}

	execute(interaction) {
		if ( interaction.options.getSubcommandGroup() )
		{
			switch(interaction.options.getSubcommandGroup())
			{
				case 'servers': this.configServers(interaction); break;
				case 'game-selector': this.configGameSelector(interaction); break;
				case 'feeds': this.configFeeds(interaction); break;
			}
		}
		else
		{
			switch(interaction.options.getSubcommand())
			{
				case 'create-status': this.configStatus(interaction); break;
				case 'suggest': this.configSuggest(interaction); break;
				case 'lang-selector': this.configLangSelector(interaction); break;
			}
		}
	}

	async onAutocomplete(interaction) {
		const focusedOption = interaction.options.getFocused(true);
	
		if ( interaction.options.getSubcommandGroup() === "game-selector" )
		{
			const games = await client.provider.get(interaction.guild.id, 'games', []);
		
			const filtered = games.filter((game) => game.name.startsWith(focusedOption.value));
			interaction.respond(filtered.map((game) => ({ name: game.name, value: game.name })));
		}
	}
	
	/*-----------------------------*/
	/*      Servers Config         */
	/*-----------------------------*/
	configServers(interaction) {
		switch(interaction.options.getSubcommand())
		{
			case 'add': this.addServer(interaction); break;
			case 'remove': this.removeServer(interaction); break;
			case 'reset': this.resetServer(interaction); break;
		}
	}

	async addServer(interaction) {	
		await interaction.deferReply();

		const api = new mTxServApi()
		const isAuthenticated = await api.isAuthenticated(interaction.user.id)
		if (!isAuthenticated) {
			const response =  mTxServUtil.sayError(mTxServUtil.translate(interaction, ["servers", "config", "add", "not_logged"]));

			await interaction.editReply({ embeds: [response] });

			return;
		}

		let oauth

		try {
			oauth = await api.loginFromCredentials(interaction.user.id)
		} catch(err) {
			console.error(err)
			const response = mTxServUtil.sayError(mTxServUtil.translate(interaction, ["servers", "config", "add", "cant_fetch"]));

			await interaction.editReply({ embeds: [response] });

			return;
		}

		const invoices = await api.call(oauth['access_token'], 'invoices')

		const gsApi = new GameServerApi()

		const list = []

		for (const invoice of invoices) {
			if (invoice.type_id !== 1) {
				continue;
			}

			const status = await gsApi.status(invoice.game, invoice.host, invoice.port)
			list.push({
				invoice: invoice,
				status: status
			})
		}

		if (!list.length) {
			interaction.editReply({
				embeds: [mTxServUtil.sayError(mTxServUtil.translate(interaction, ["servers", "config", "add", "no_result"]))]
			});

			return
		}

		const embed = new EmbedBuilder()
			.setColor(Colors.Blue)
			.setTimestamp()
			.setTitle(mTxServUtil.translate(interaction, ["servers", "config", "add", "title_select"]))
			.setDescription(mTxServUtil.translate(interaction, ["servers", "config", "add", "description_select"]));

		let row = new ActionRowBuilder()
		
		const option = []
		for (const server of list) {
			option.push({
				label: server.status.params.host_name||server.invoice.cache_hostname||server.invoice.name||server.invoice.address.toUpperCase(),
				description: `${server.invoice.address.toUpperCase()} - ${server.status.params.used_slots||0}/${server.status.params.max_slots||0}`,
				value: option.length.toString(),
				emoji: server.status.is_online?'🟢':'🔴'
			})
		}

		row.addComponents( 
			new SelectMenuBuilder()
				.setCustomId('servers')
				.setMinValues(0)
				.setMaxValues(option.length)
				.setPlaceholder(mTxServUtil.translate(interaction, ["servers", "config", "add", "select"]))
				.addOptions(option)
		)

		const message = await interaction.editReply({ embeds: [embed], components: [row] })

		const filter = (componentInt) => { return componentInt.user.id === interaction.user.id }

		const collector = message.createMessageComponentCollector({
			filter,
			max: 1,
			time: 40_000,
			errors: ['time']
		})

		collector.on('collect', async (i) => {
			for (const id of i.values)
			{
				const serverKey = parseInt(id)

				if (typeof list[serverKey] === 'undefined') {
					continue
				}

				let gameServers = await client.provider.get(interaction.guild.id, 'servers', [])        
				gameServers = gameServers.filter(gs => gs.address !== list[serverKey].invoice.address)
				
				gameServers.push({
					game: list[serverKey].invoice.game,
					address: list[serverKey].invoice.address,
					isHostedOnMtxServ: true,
					creatorId: interaction.user.id
				})

				await client.provider.set(interaction.guild.id, 'servers', gameServers)
			}
		})

		collector.on('ignore', (i) => {
			i.reply({ 
				content: mTxServUtil.translate(interaction, ["servers", "config", "no_authorization"]),
				ephemeral: true
			});
		})

		collector.on('end', async collected => {
			if (collected.size === 0)
			{
				await interaction.editReply({
					embeds: [mTxServUtil.sayError(mTxServUtil.translate(interaction, ["servers", "config", "timeout"]))],
					components: []
				})
			}
			else
			{
				await interaction.editReply({
					content: mTxServUtil.translate(interaction, ["servers", "config", "add", "interaction_end"]),
					embeds: [mTxServUtil.saySuccess(mTxServUtil.translate(interaction, ["servers", "config", "add", "success"]))],
					components: []
				})
			}
		})
	}

	async removeServer(interaction)
	{
		await interaction.deferReply();

		const gsApi = new GameServerApi()

		const invoices = await client.provider.get(interaction.guild.id, 'servers', []);
		const list = []

		for (const invoice of invoices) {
			const status = await gsApi.status(invoice.game, invoice.address.split(':')[0], invoice.address.split(':')[1])
			list.push({
				invoice: invoice,
				status: status
			})
		}

		if (!list.length) {
			interaction.editReply({
				embeds: [mTxServUtil.sayError(mTxServUtil.translate(interaction, ["servers", "config", "remove", "no_result"]))]
			});

			return
		}

		const embed = new EmbedBuilder()
			.setColor(Colors.Blue)
			.setTimestamp()
			.setTitle(mTxServUtil.translate(interaction, ["servers", "config", "remove", "title_select"]))
			.setDescription(mTxServUtil.translate(interaction, ["servers", "config", "remove", "description_select"]));

		let row = new ActionRowBuilder()
		
		const option = []
		for (const server of list) {
			option.push({
				label: server.status.params.host_name||server.invoice.cache_hostname||server.invoice.name||server.invoice.address.toUpperCase(),
				description: `${server.invoice.address.toUpperCase()} - ${server.status.params.used_slots||0}/${server.status.params.max_slots||0}`,
				value: option.length.toString(),
				emoji: server.status.is_online?'🟢':'🔴'
			})
		}

		row.addComponents( 
			new SelectMenuBuilder()
				.setCustomId('servers')
				.setMinValues(0)
				.setMaxValues(option.length)
				.setPlaceholder(mTxServUtil.translate(interaction, ["servers", "config", "remove", "select"]))
				.addOptions(option)
		)

		const message = await interaction.editReply({ embeds: [embed], components: [row] })

		const filter = (componentInt) => { return componentInt.user.id === interaction.user.id }

		const collector = message.createMessageComponentCollector({
			filter,
			max: 1,
			time: 40_000,
			errors: ['time']
		})

		collector.on('collect', async (i) => {
			for (const id of i.values)
			{
				const serverKey = parseInt(id)

				if (typeof list[serverKey] === 'undefined') {
					continue
				}

				let gameServers = await client.provider.get(interaction.guild.id, 'servers', [])
				gameServers = gameServers.filter(gs => gs.address !== list[serverKey].invoice.address)

				await client.provider.set(interaction.guild.id, 'servers', gameServers)
			}
		})

		collector.on('ignore', (i) => {
			i.reply({ 
				content: mTxServUtil.translate(interaction, ["servers", "config", "no_authorization"]),
				ephemeral: true
			});
		})

		collector.on('end', async collected => {
			if (collected.size === 0)
			{
				await interaction.editReply({
					embeds: [mTxServUtil.sayError(mTxServUtil.translate(interaction, ["servers", "config", "timeout"]))],
					components: []
				})
			}
			else
			{
				await interaction.editReply({
					content: mTxServUtil.translate(interaction, ["servers", "config", "remove", "interaction_end"]),
					embeds: [mTxServUtil.saySuccess(mTxServUtil.translate(interaction, ["servers", "config", "remove", "success"]))],
					components: []
				})
			}
		})	
	}

	async resetServer(interaction) {
		await client.provider.set(interaction.guild.id, 'servers', [])

		const response = mTxServUtil.saySuccess(mTxServUtil.translate(interaction, ["servers", "config", "reset", "success"]));

		await interaction.reply({ embeds: [response] });
	}



	/*-----------------------------*/
	/*    Game Selector Config     */
	/*-----------------------------*/
	configGameSelector(interaction) {
		switch(interaction.options.getSubcommand())
		{
			case 'add'   : this.addGame(interaction); break;
			case 'remove': this.removeGame(interaction); break;
			case 'create': this.create(interaction); break;
		}
	}

	async addGame(interaction) {	
		const name  = interaction.options.get("game").value;
		const emoji = interaction.options.get("emoji").value;
		const role  = interaction.options.getRole("role").id;
		
		const regexDefaultEmoji = /^\p{Extended_Pictographic}$/gu;
		const regexCustomEmoji = /^<:.+?:\d+>$/g;
		if ( !emoji.match(regexDefaultEmoji) && (!emoji.match(regexCustomEmoji) || client.emojis.cache.get( emoji.match(/\d+/g) )) )
		{
			const response = mTxServUtil.sayError(mTxServUtil.translate(interaction, ["game-selector","add","invalid_emoji"]));
			await interaction.reply({ embeds: [response] });

			return;
		}

		const games = await client.provider.get(interaction.guild.id, 'games', [])

		for(const game of games)
		{
			if (game.role === role)
			{
				const response = mTxServUtil.sayError(mTxServUtil.translate(interaction, ["game-selector","add","role_already_exist"]));
				await interaction.reply({ embeds: [response] });

				return;
			}

			if (game.name === name)
			{
				const response = mTxServUtil.sayError(mTxServUtil.translate(interaction, ["game-selector","add","name_already_exist"]));
				await interaction.reply({ embeds: [response] });

				return;
			}
		}

		games.push({
			name: name,
			emoji: emoji,
			role: role
		})

		const options = [];

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
			const response = mTxServUtil.saySuccess(mTxServUtil.translate(interaction, ["game-selector","add","success"], {"game": name, "emoji": emoji}));
			
			await interaction.reply({ embeds: [response] });
			
			await client.provider.set(interaction.guild.id, 'games', games);
		}
		else
		{
			const response = mTxServUtil.sayError(mTxServUtil.translate(interaction, ["game-selector","missing_message"])); 
			
			await interaction.reply({ embeds: [response] });
		}
	}

	async removeGame(interaction)
	{
		const game = interaction.options.get("game").value;

		const oldGames = await client.provider.get(interaction.guild.id, 'games', [])

		const newGames = oldGames.filter((item) => {
			return item.name !== game
		})

		if ( oldGames.length === newGames.length )
		{
			const response = mTxServUtil.sayError(mTxServUtil.translate(interaction, ["game-selector","remove", "invalid_name"])); 
			
			await interaction.reply({ embeds: [response] });

			return;
		}

		const options = [];

		for(const game of newGames)
		{
			options.push({
				label: game.name,
				emoji: game.emoji,
				value: game.role
			})
		}
		
		if ( await this.updateSelection(interaction, options) )
		{
			const response = mTxServUtil.saySuccess(mTxServUtil.translate(interaction, ["game-selector","remove","success"], {"game": game}));

			await interaction.reply({ embeds: [response] });
			await client.provider.set(interaction.guild.id, 'games', newGames);
		}
		else
		{
			const response = mTxServUtil.sayError(mTxServUtil.translate(interaction, ["game-selector","missing_message"]));
			
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
		} catch(error) {
			console.log(error)
		}

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

		const options = [];

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

		const response = mTxServUtil.saySuccess(mTxServUtil.translate(interaction, ["game-selector","create","success"]));

		await interaction.reply({
			embeds: [response],
			ephemeral: true,
		})
	}


	/*-----------------------------*/
	/*        Feeds Config         */
	/*-----------------------------*/
	configFeeds(interaction) {
		switch(interaction.options.getSubcommand())
		{
			case 'add'   : this.addFeed(interaction); break;
			case 'remove': this.removeFeed(interaction); break;
		}
	}

	async addFeed(interaction) {
		const game = interaction.options.get("game").value
		const channel = interaction.options.getChannel("channel")
		const locale = interaction.options.get("locale").value

		await client.provider.rootRef
			.child(interaction.guild.id)
			.child('feeds_suscribed')
			.child(game)
			.child(locale)
			.set(channel.id)

		const response = mTxServUtil.saySuccess(mTxServUtil.translate(interaction, ["feeds", "config", "add", "success"], {
			"game": game.toUpperCase(),
			"locale": locale === 'all' ? 'all languages' : locale.toUpperCase(),
			"channel": channel.name
		}))

		await interaction.reply({ embeds: [response] });
	}

	async removeFeed(interaction) {
		const game = interaction.options.get("game").value

		await client.provider.rootRef
			.child(interaction.guild.id)
			.child('feeds_suscribed')
			.child(game)
			.remove()

		const response = mTxServUtil.saySuccess(mTxServUtil.translate(interaction, ["feeds", "config", "remove", "success"], { "game": game.toUpperCase() }))
		
		await interaction.reply({ embeds: [response] });
	}


	/*-----------------------------*/
	/*       Status Config         */
	/*-----------------------------*/
	async configStatus(interaction) {
		const channel = interaction.options.getChannel("channel");

		const statusMsg = await channel.send({
			content: "Waiting a refresh"
		});

		await client.provider.set('status', statusMsg.guild.id, {channel: statusMsg.channel.id, message: statusMsg.id});

		client.statusMonitor.process();

		const response = mTxServUtil.saySuccess(mTxServUtil.translate(interaction, ["create-status","success"]));

		await interaction.reply({
			embeds: [response],
			ephemeral: true
		});
	}


	/*-----------------------------*/
	/*      Suggest Config         */
	/*-----------------------------*/
	async configSuggest(interaction) {
		const channel = interaction.options.getChannel("channel")

		await client.provider.set(interaction.guild.id, 'suggest-config', channel.id)

		const response = mTxServUtil.saySuccess(mTxServUtil.translate(interaction, ["suggest", "config", "success"], { "channel": channel.name }))

		await interaction.reply({ embeds: [response] });
	}

	/*-----------------------------*/
	/*      Suggest Config         */
	/*-----------------------------*/
	async configLangSelector(interaction) {
		const channel = interaction.options.getChannel("channel");

		const embed = new EmbedBuilder()
			.setAuthor({ name: client.user.tag, iconURL: client.user.displayAvatarURL() })
			.setColor(Colors.Orange)
			.addFields([
				{
					name: ":flag_fr: Bienvenue sur mTxServ!",
					value: "Vous parlez Français? **Cliquez sur :flag_fr:** pour activer les sections françaises."
				},
				{
					name: ":flag_us: Welcome on mTxServ!",
					value: "Do you speak English? **Click :flag_us:** to see english sections."
				}
			])
			.setFooter({ text: 'Choose your language / Choisissez votre langue - mTxServ.com' });

		let row = new ActionRowBuilder()

		const option = [
			{
				label: 'Français',
				value: interaction.guild.roles.cache.find(r => r.name.toLowerCase() === "fr").id,
				emoji: '🇫🇷'
			},
			{
				label: 'English',
				value: interaction.guild.roles.cache.find(r => r.name.toLowerCase() === "en").id,
				emoji: '🇺🇸'
			}
		]

		row.addComponents(
			new SelectMenuBuilder()
			.setCustomId('lang-selector')
			.setMinValues(0)
			.setMaxValues(option.length)
			.setPlaceholder('Choose your language / Choisissez votre langue')
			.addOptions(option)
		)

		await channel.send({
			embeds: [embed],
			components: [row]
		})

		const reponse = mTxServUtil.saySuccess(mTxServUtil.translate(interaction, ["lang-selector","success"]))

		await interaction.reply({
			embeds: [reponse],
			ephemeral: true
		});
	}
};