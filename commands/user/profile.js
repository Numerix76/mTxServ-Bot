const Discord = require('discord.js');
const mTxServUtil = require('../../util/mTxServUtil');
const mTxServApi = require('../../api/mTxServApi');

module.exports = {
	name: 'profile',
	aliases: ['rank', 'point', 'level'],
	category: 'User',
	description: 'Show my profile',
	permissions: ['SEND_MESSAGES'],
	slash: 'both',
    guildOnly: true,

    expectedArgs: '<member>',
	expectedArgsTypes: ['USER'],
    
    minArgs: 0,
    maxArgs: 1,

	callback: async ({ client, message, interaction, args }) => {
		const msg = message || interaction;

		const lang = require(`../../languages/${await mTxServUtil.resolveLangOfMessage(msg)}.json`);
		const author = msg.author || msg.user
        let user = (message?message.mentions.users.first() : interaction.options.getUser("member"))

        if (!user)
            user = author

        const userScores = await client.ranker.getScoresOfUser(msg.guild.id, user, true)
        const embed = new Discord.MessageEmbed()
            .setThumbnail(user.avatarURL())
            .setColor('#A4F2DF')
        ;

        // me
        const api = new mTxServApi()
        let isAuthenticated = await api.isAuthenticated(user.id)
        let profile = {
            about: false,
            is_admin: false,
            discord_url: null,
            facebook_url: null,
            twitter_url: null,
            youtube_url: null,
            instagram_url: null,
            twitch_url: null,
            website_url: null,
            workshop_url: null,
            tutorial_add_link: null,
            tutorials: [],
        }

        if (isAuthenticated) {
            try {
                const oauth = await api.loginFromCredentials(user.id)
                profile = await api.call(oauth['access_token'], 'user/me')
                isAuthenticated = true
            } catch(err) {
                isAuthenticated = false
                console.error(err)
            }
        }

        // scores
        const allMembers = Object.values(await client.ranker.getScoresOfGuild(msg.guild.id))

        const filteredMembers = allMembers
            .filter(scores => scores.points >= userScores.points)

        // embed
        embed.setAuthor(`${user.username} profile`, null, profile.website_url)
        embed.addField(':star: Points', `${userScores.points}`, true);
        embed.addField(':chart_with_upwards_trend: Level', `${userScores.level}`, true);
        embed.addField(':medal: Rank', `${filteredMembers.length}`, true);
        embed.addField(':paperclips: Linked', `${isAuthenticated ? '✓':'✗'}`, true);

        let description = profile.about || ''

        if (typeof profile.tutorials !== 'undefined' && profile.tutorials.length) {
            description += `\n\n**Latest tutos by ${user.username}** ([how to write a tuto](${profile.tutorial_add_link}))`

            for (const tutorial of profile.tutorials) {
                description += `\n✓ [${tutorial.title}](${tutorial.link})`
            }
        }

        description = profile.about ? description : description + "\n\n[Edit my profile](https://mtxserv.com/fr/mon-compte)"

        embed.setDescription(description)

        if (profile.is_admin) {
            embed.setFooter(`💫 ${user.username} is admin`)
        }

        if (profile.website_url) {
            embed.addField(`Website`, `[Visit website](${profile.website_url})`, true)
        }

        if (profile.workshop_url) {
            embed.addField(`Workshop`, `[STEAM Workshop](${profile.workshop_url})`, true)
        }

        if (profile.discord_url) {
            embed.addField(`Discord`, `[Join server](${profile.discord_url})`, true)
        }

        if (profile.twitter_url) {
            embed.addField(`Twitter`, `[Twitter](${profile.twitter_url})`, true)
        }

        if (profile.youtube_url) {
            embed.addField(`Youtube`, `[Youtube](${profile.youtube_url})`, true)
        }

        if (profile.twitch_url) {
            embed.addField(`Twitch`, `[Twitch](${profile.twitch_url})`, true)
        }

        if (profile.facebook_url) {
            embed.addField(`Facebook`, `[Facebook](${profile.facebook_url})`, true)
        }

        return embed
	}
};