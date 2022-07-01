const { Command, Constants } = require("sheweny");
const mTxServUtil = require("../../util/mTxServUtil");
const { EmbedBuilder, Colors } = require("discord.js");
const { execSync } = require('child_process');
const FeedMonitor = require("../../services/FeedMonitor");

module.exports = class FeedsCommand extends Command {
	constructor(client) {
		super(client, {
			name: "feeds",
			nameLocalizations: {
				'fr': 'feeds'
			},
			description: "Display feeds list.",
			descriptionLocalizations: {
				'fr': 'Affiche la liste des feeds.',
			},
			category: "Feeds",
			userPermissions: ["SendMessages"],
			channel: Constants.COMMAND_CHANNEL.guild,
		});
	}

	async execute(interaction) {
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

        const embed = new EmbedBuilder()
            .setAuthor({ name: mTxServUtil.translate(interaction, ["feeds", "list", "title"]) })//lang['feeds']['title'])
            .setColor(Colors.Blue)
            .setDescription(mTxServUtil.translate(interaction, ["feeds", "list", "description"]))//lang['feeds']['description'])
        ;


        for (const game of games) {
            const followFR = await FeedMonitor.isFollowing(interaction.guild.id, game.key, 'fr', false)
            const followEN = await FeedMonitor.isFollowing(interaction.guild.id, game.key, 'en', false)
            const followAll = await FeedMonitor.isFollowing(interaction.guild.id, game.key, 'all', false)

            let description = ''

            if (!followFR && !followEN && !followAll) {
                description = `*${mTxServUtil.translate(interaction, ["feeds", "list", "unfollow"])/*lang['feeds']['unfollow']*/}*`
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

            embed.addFields({ name: `❯ ${game.name}`, value: description, inline: true });
        }

		await interaction.reply({ embeds: [embed] });
	}
}