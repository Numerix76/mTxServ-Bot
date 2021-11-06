const Discord = require('discord.js');
const mTxServUtil = require('../../util/mTxServUtil');

module.exports = {
	name: 'giveaway',
	category: 'mTxServ',
	description: 'Show current giveaway (in english).',
	permissions: ['SEND_MESSAGES'],
	slash: 'both',

	callback: async ({ client, message, interaction, args }) => {
		const msg = message || interaction;
		const lang = require(`../../languages/${await mTxServUtil.resolveLangOfMessage(msg)}.json`);
		const author = message?message.author:interaction.user

		const prizes = [
            '1x [VPS SSD 4 Go](https://mtxserv.com/fr/vps-ssd) - 1 mois',
            '2x [Nitro Boost](https://discord.com)',
            //'3x [STEAM CARD 5€](https://store.steampowered.com/digitalgiftcards/)',
            //'1x [Serveur Rust Starter](https://mtxserv.com/fr/hebergeur-serveur-rust) - 1 mois',
            //'1x [Serveur ARK Starter](https://mtxserv.com/fr/hebergeur-serveur-ark) - 1 mois',
        ]

        const actions = [
            '> **+30 points**・Boostez le serveur discord de mTxServ',
            '> **+30 points**・Suivez le channel <#563304015924953108> sur votre serveur discord',
            '> **+10 points**・Réagissez à ce message avec :gift:',
            '> **+10 points**・Retweetez le [message sur twitter](https://twitter.com/mTxServ/status/1334211860598558721) et suivez le compte [@mTxServ](https://twitter.com/mTxServ)',
            '> **+10 points**・[Invitez le <#769619263078006844> sur votre discord](https://discord.com/oauth2/authorize?client_id=535435520394657794&permissions=912577&scope=bot) puis poster le message du giveaway  avec \`m!giveaway\` sur son serveur',
        ]

		const endDate = '6 Dec à 18H'

		const prizeLabel = prizes.map(prize => `> ❯ ${prize}`).join('\n')

		const embed = new Discord.MessageEmbed()
			.setTitle('GIVEAWAY')
			.setColor('YELLOW')
		;
		
		if (msg.channel.type !== 'DM' && client.isMainGuild(msg.guild.id) && client.isOwner(author)) {
			embed.setDescription(`:four_leaf_clover: Pour participer, réagissez avec :gift: à ce message.\n\nTirage au sort le **${endDate}**\n\n:four_leaf_clover: **Participer et Augmenter ses chances** :four_leaf_clover:\n\n${actions.join('\n')}\n\n:gift_heart: **Lots** :gift_heart:\n\n${prizeLabel}`)

			const giveawayMsg = await msg.reply({
				embeds: [embed],
		   	})

			giveawayMsg.react('🎁')
		}
	},
};
