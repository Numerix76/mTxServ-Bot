const Discord = require('discord.js');
const mTxServUtil = require('../../util/mTxServUtil');

module.exports = {
	name: 'giveaway-en',
	category: 'mTxServ',
	description: 'Show current giveaway (in english).',
	permissions: ['SEND_MESSAGES'],
	slash: 'both',

	callback: async ({ client, message, interaction, args }) => {
		const msg = message || interaction;
		const lang = require(`../../languages/${await mTxServUtil.resolveLangOfMessage(msg)}.json`);
		const author = message?message.author:interaction.user

		const prizes = [
			'1x [4GB SSD VPS](https://mtxserv.com/ssd-vps) - 1 month',
			'2x [Nitro Boost](https://discord.com)',
		]

		const actions = [
			'> **+30 points**・Boost the mTxServ discord server',
			'> **+30 points**・Follow <#777240538910818324> on your discord server',
			'> **+10 points**・React to this message with :gift:',
		]

		const endDate = 'December 6, 2020 at 6 PM\n'

		const prizeLabel = prizes.map(prize => `> ❯ ${prize}`).join('\n')

		const embed = new Discord.MessageEmbed()
			.setTitle('GIVEAWAY')
			.setColor('YELLOW')
		;
		
		if (msg.channel.type !== 'DM' && client.isMainGuild(msg.guild.id) && client.isOwner(author)) {
			embed.setDescription(`:four_leaf_clover: To participate, react with :gift:.\n\nDraw on **${endDate}**\n\n:four_leaf_clover: **Participate and Increase your chances** :four_leaf_clover:\n\n${actions.join('\n')}\n\n:gift_heart: **Prizes** :gift_heart:\n\n${prizeLabel}`)

			const channel = await client.channels.cache.get('563304015924953108')

			const giveawayMsg = await msg.reply({
				embeds: [embed],
		   	})

			giveawayMsg.react('🎁')
		}
	},
};
