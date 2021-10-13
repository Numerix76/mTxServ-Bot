const Discord = require('discord.js')
const Util = require('../util/Util')
const mTxServUtil = require('../util/mTxServUtil.js')

module.exports = class GuildBotAdded {
	// guildCreate event
	static async handleEvent(guild) {
		if (!guild.ownerId) {
			return;
		}
		
		const owner = await guild.members.fetch(guild.ownerId)
		if (!owner) {
			return;
		}

		const embedWelcome = new Discord.MessageEmbed()
			.setAuthor(`${client.user.tag}`, `${client.user.displayAvatarURL()}`, 'https://mtxserv.com')
			.setColor('BLUE')
			.setDescription(`Thanks for adding me, I successfully joined your server \`${guild.name}\`. To see all commands, use \`m!help\`.\n\nSet the main language for your server with \`m!bot-lang en\` or \`m!bot-lang fr\` in a channel.\n\n**__Game Server Status__**\nTo enable the command \`m!servers\` on your discord server, use \`m!add-server\` to configure it, in a channel.\n\n**__Follow your favorites games__**\nThe bot can post new articles in english or/and french, about your favorites games, in a specified channel. To configure it, use \`m!feeds\` in a channel.`)

		owner
			.send({
				embeds: [embedWelcome]
			})
			.catch((err) => {
				//console.log(err)

				const defaultChannel = Util.getDefaultChannel(guild);
				if (defaultChannel) {
					defaultChannel.send({
						embeds: [embedWelcome]
					})
				}
			});

		const embedLog = new Discord.MessageEmbed()
			.setColor('BLUE')
			.setTitle('Join a new guild')
			.setDescription(`Bot is on a new guild **\`${guild.name.replace('`', '\`')}\`**`)
			.addField('Owner :', owner.user.tag, true)
			.addField('Guild ID :', `\`${guild.id}\``, true)
			.addField('Members :', `\`${guild.memberCount}\``, true)
			.setTimestamp();

		mTxServUtil.sendLogMessage(embedLog)
	}
}