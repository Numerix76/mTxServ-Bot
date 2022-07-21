const { EmbedBuilder } = require("@discordjs/builders")
const { Colors, PermissionsBitField } = require("discord.js")

class Ranker {
	async getScoresOfGuild(guildId) {
		return await client.provider.get(guildId, 'scores', [])
	}

	async resetScoresOfGuild(guildId) {
		return await client.provider.remove(guildId, 'scores')
	}

	async setScoresOfUser(guildId, userId, scores) {
		const currentScores = await this.getScoresOfGuild(guildId)
		currentScores[userId] = scores

		await client.provider.set(guildId, 'scores', currentScores)
	}

	async getScoresOfUser(guildId, user, initIfNotFound) {
		const currentScores = await this.getScoresOfGuild(guildId)
		if (initIfNotFound && typeof currentScores[user.id] === 'undefined') {
			return {
				points: 0,
				level: 0,
				userId: user.id,
				username: user.username,
				lastMessage: new Date().getTime()
			}
		}

		return typeof currentScores[user.id] !== 'undefined' ? currentScores[user.id] : null;
	}

	async processMessage(msg) {
		const currentScores = await this.getScoresOfUser(msg.guild.id, msg.author, true)
		const oldLevel = currentScores.level

		// increments scores
		currentScores.points += 1;

		const newLevel = Math.floor(0.3 * Math.sqrt(currentScores.points));
		currentScores.level = newLevel;

		// save
		await this.setScoresOfUser(msg.guild.id, msg.author.id, currentScores)

		// notify levels
		if (currentScores.level > oldLevel) {
			const embed = new EmbedBuilder()
				.setAuthor({ name: client.user.tag, iconURL: client.user.displayAvatarURL(), url: 'https://mtxserv.com'})
				.setDescription(`Congratulations <@${msg.author.id}>, you just advanced to **level ${currentScores.level}**!`)
				.setColor(Colors.Green)
				.setTimestamp()
			;

			if( msg.guild.members.me.permissionsIn(msg.channel).has(PermissionsBitField.Flags.SendMessages) )
			{
				msg.channel.send({
					embeds : [embed]
				})
			}
			else
			{
				console.log("Impossible d'envoyer le message de level")
			}
		}
	}
}

module.exports = Ranker;