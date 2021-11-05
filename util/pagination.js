const { MessageActionRow, MessageButton } = require("discord.js");
const mTxServUtil = require('./mTxServUtil');

const paginationEmbed = async (msg, interaction, pages, timeout = 120000) => {
	if (!msg && !msg.channel) throw new Error('Channel is inaccessible.');
	if (!pages) throw new Error('Pages are not given.');
	
    const lang = require(`../languages/${await mTxServUtil.resolveLangOfMessage(msg)}.json`)

	const row = new MessageActionRow()
		.addComponents(
			new MessageButton()
				.setCustomId('prev')
				.setLabel(lang["pages"]["previous"])
				.setStyle('SECONDARY')
		)
		.addComponents(
			new MessageButton()
				.setCustomId('next')
				.setLabel(lang["pages"]["next"])
				.setStyle('SECONDARY')
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
		if (!curPage.deleted) {
			mTxServUtil.editResponse(curPage, interaction, {
				components: []
			});
		}
	});

	return curPage;
};
module.exports = paginationEmbed;