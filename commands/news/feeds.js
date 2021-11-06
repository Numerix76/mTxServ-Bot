const Discord = require('discord.js');
const mTxServUtil = require('../../util/mTxServUtil');
const FeedMonitor = require('../../services/FeedMonitor');

module.exports = {
	name: 'feeds',
	aliases: ['feed', 'news'],
	category: 'mTxServ',
	description: 'Display feeds list.',
	permissions: ['ADMINISTRATOR'],
	slash: 'both',
	guildOnly: true,

	callback: async ({ client, message, interaction, args }) => {
		const msg = message || interaction;
		const lang = require(`../../languages/${await mTxServUtil.resolveLangOfMessage(msg)}.json`);
		
		const games = [
            {
                name: 'Minecraft',
                key: 'minecraft'
            },
            {
                name: 'Hytale',
                key: 'hytale'
            },
            {
                name: 'GMod',
                key: 'gmod'
            },
            {
                name: 'Rust',
                key: 'rust'
            },
            {
                name: 'ARK',
                key: 'ark'
            },
            {
                name: 'CS:GO',
                key: 'csgo'
            },
            {
                name: 'Valorant',
                key: 'valorant'
            },
            {
                name: 'League of Legends',
                key: 'lol'
            },
            {
                name: 'Overwatch',
                key: 'overwatch'
            },
            {
                name: 'Fortnite',
                key: 'fortnite'
            },
            {
                name: 'Rocket League',
                key: 'rocketleague'
            },
            {
                name: 'S&Box',
                key: 'sandbox'
            },
            {
                name: 'Web',
                key: 'web'
            },
            {
                name: 'Science',
                key: 'science'
            },
            {
                name: 'Film & Series',
                key: 'film'
            },
        ]

        const embed = new Discord.MessageEmbed()
            .setAuthor(lang['feeds']['title'])
            .setColor('BLUE')
            .setDescription(lang['feeds']['description'])
        ;


        for (const game of games) {
            const followFR = await FeedMonitor.isFollowing(msg.guild.id, game.key, 'fr', false)
            const followEN = await FeedMonitor.isFollowing(msg.guild.id, game.key, 'en', false)
            const followAll = await FeedMonitor.isFollowing(msg.guild.id, game.key, 'all', false)

            let description = ''

            if (!followFR && !followEN && !followAll) {
                description = `*${lang['feeds']['unfollow']}*`
            } else {
                if (followAll) {
                    description = description + `:flag_us: :flag_fr: <#${followAll}>`
                }

                if(followFR) {
                    description = description + `${followAll ? '\n' : ''}:flag_fr: <#${followFR}>`
                }

                if(followEN) {
                    description = description + `${followAll || followFR ? '\n' : ''}:flag_us: <#${followEN}>`
                }
            }

            embed.addField(`❯ ${game.name}`, description, true)
        }

        return embed
    }
};
