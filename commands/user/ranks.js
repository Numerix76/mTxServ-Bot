const Discord = require('discord.js');
const mTxServUtil = require('../../util/mTxServUtil');
const paginationEmbed = require('../../util/pagination');

module.exports = {
	name: 'ranks',
	aliases: ['levels', 'top'],
	category: 'User',
	description: 'Show top ranking',
	permissions: ['SEND_MESSAGES'],
	slash: 'both',
    guildOnly: true,

	callback: async ({ client, message, interaction, args }) => {
		const msg = message || interaction;

		const lang = require(`../../languages/${await mTxServUtil.resolveLangOfMessage(msg)}.json`);
		const author = msg.author || msg.user

        const topMembers = Object.values(await client.ranker.getScoresOfGuild(msg.guild.id))
            .sort((a, b) => (a.points < b.points) ? 1 : -1 )
            .slice(0, 10)

        const pages = []
        let i = 1

        for (const userScores of topMembers) {
            const embed = new Discord.MessageEmbed()
                .setColor('#A4F2DF')
            ;
            const user = await client.users.cache.get(userScores.userId)
            if (user) {
                embed
                    .setAuthor(`#${i}. ${user.username}`, user.avatarURL())
                    .setThumbnail(user.avatarURL())

            } else {
                embed.setTitle(`#${i}. ${userScores.username}`)
            }

            embed.addField('Points', `${userScores.points}`, true);
            embed.addField('Level', `${userScores.level}`, true);
            embed.addField('Rank', `${i}`);

            i++
            pages.push(embed)
        }

        if (pages.length === 1) {
			const embed = pages[0]
			return embed
		}

		paginationEmbed(msg, interaction, pages);
	}
};