const { Command, Constants } = require("sheweny");
const { ApplicationCommandOptionType, ActionRowBuilder, SelectMenuBuilder, EmbedBuilder, Colors } = require("discord.js");
const mTxServUtil = require("../../util/mTxServUtil");
const mTxServApi = require("../../api/mTxServApi");
const GameServerApi = require("../../api/GameServerApi");

module.exports = class ServersConfigCommand extends Command {
	constructor(client) {
		super(client, {
			name: "servers-config",
			nameLocalizations: {
				'fr': 'servers-config'
			},
			description: "Add or Remove a server",
			descriptionLocalizations: {
				'fr': 'Ajoute ou Retire un serveur',
			},
			category: "GameServer",
			userPermissions: ["Administrator"],
			channel: Constants.COMMAND_CHANNEL.guild,
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
		});
	}

	execute(interaction) {
		switch(interaction.options.getSubcommand())
		{
			case 'add'   : this.addServer(interaction); break;
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
};