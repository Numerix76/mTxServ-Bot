const { ActionRowBuilder, ButtonBuilder } = require("@discordjs/builders");
const { ButtonStyle } = require("discord.js");
const mTxServUtil = require("./mTxServUtil");


const paginationEmbed = async (interaction, pages, timeout = 120000) => {
	if (!interaction && !interaction.channel) throw new Error('Channel is inaccessible.');
	if (!pages) throw new Error('Pages are not given.');

	let response;
	if ( pages.length === 1 )
	{
		const options = { embeds: pages };
	
		if ( interaction.deferred )
		{
			response = await interaction.editReply(options);
		}
		else
		{
			response = await interaction.reply(options);
		}

		return response;
	}

	const row = new ActionRowBuilder()
		.addComponents(
			new ButtonBuilder()
				.setCustomId('prev')
				.setLabel(mTxServUtil.translate(interaction, ["pagination", "previous"]))
				.setStyle(ButtonStyle.Secondary)
		)
		.addComponents(
			new ButtonBuilder()
				.setCustomId('next')
				.setLabel(mTxServUtil.translate(interaction, ["pagination", "next"]))
				.setStyle(ButtonStyle.Secondary)
		)

	let page = 0;

	const options = {
		embeds: [pages[page].setFooter({ text: mTxServUtil.translate(interaction, ["pagination", "footer"], { "curPage": page+1, "maxPage": pages.length}) })],
		components: [row]
	};

	if ( interaction.deferred )
	{
		response = await interaction.editReply(options);
	}
	else
	{
		response = await interaction.reply(options);
	}

	const filter = (i) => {
		return i.user.id === interaction.user.id;
	}

	const collector = response.createMessageComponentCollector({
		filter,
		time: timeout
	})
	
	collector.on('collect', i => {
		switch (i.customId) {
			case 'prev':
				page = page > 0 ? --page : pages.length - 1;
				break;
			case 'next':
				page = page + 1 < pages.length ? ++page : 0;
				break;
			default:
				break;
		}

		i.update({
			embeds: [pages[page].setFooter({ text: mTxServUtil.translate(interaction, ["pagination", "footer"], { "curPage": page+1, "maxPage": pages.length}) })]
		});
	})

	collector.on('ignore', (i) => {
		i.reply({ 
			content: mTxServUtil.translate(interaction, ["pagination", "no_authorization"]),
			ephemeral: true
		});
	})

	collector.on('end', () => {
		if (interaction || !response.deleted) {
			interaction.editReply({
				components: []
			});
		}
	});

	return response;
};
module.exports = paginationEmbed;