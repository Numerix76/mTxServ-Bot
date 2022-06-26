const { ActionRowBuilder, ButtonBuilder } = require("@discordjs/builders");
const { ButtonStyle } = require("discord.js");
const mTxServUtil = require("./mTxServUtil");


const paginationEmbed = async (msg, interaction, pages, timeout = 120000) => {
	if (!msg && !msg.channel) throw new Error('Channel is inaccessible.');
	if (!pages) throw new Error('Pages are not given.');
	
    const lang = require(`../languages/${await mTxServUtil.resolveLangOfMessage(msg)}.json`)

	const row = new ActionRowBuilder()
		.addComponents(
			new ButtonBuilder()
				.setCustomId('prev')
				.setLabel(lang["pages"]["previous"])
				.setStyle(ButtonStyle.Secondary)
		)
		.addComponents(
			new ButtonBuilder()
				.setCustomId('next')
				.setLabel(lang["pages"]["next"])
				.setStyle(ButtonStyle.Secondary)
		)

	let page = 0;
	const curPage = await msg.reply({
		embeds: [pages[page].setFooter(`Page ${page + 1} / ${pages.length}`)],
		components: [row]
	});

	const filter = (btnInt) => {
		return true
	}

	const collector = msg.channel.createMessageComponentCollector({
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
			embeds: [pages[page].setFooter(`Page ${page + 1} / ${pages.length}`)]
		});
	})

	collector.on('end', () => {
		if (interaction || !curPage.deleted) {
			interaction.update({
				components: []
			});
		}
	});

	return curPage;
};
module.exports = paginationEmbed;