const mTxServUtil = require('../util/mTxServUtil.js')

module.exports = {
	run: async (oldMember, newMember) => {
		return;
		
		if (newMember.user.bot) {
			return
		}

		if (!client.isMainGuild(newMember.guild.id)) {
			return
		}

		const hadRole = oldMember.roles.cache.find(role => role.name === 'VIP ★');
		const hasRole = newMember.roles.cache.find(role => role.name === 'VIP ★');


		if (!hadRole && hasRole) {
			console.log(`${newMember.username} boosted ${newMember.guild.name}`)

			await client.provider.set(isDev ? 'giveaway_boost_dev' : 'giveaway_boost', newMember.user.id, {
				userId: newMember.user.id,
				userName: newMember.user.tag,
				guildName: newMember.guild.name,
				createdAt: Math.ceil(new Date().getTime() / 1000),
			})

			const embed = new Discord.MessageEmbed()
			.setColor('BLUE')
			.setDescription(`**${newMember.user.tag}** boosted \`${newMember.guild.name}\`.`)
			.setTimestamp();

			mTxServUtil.sendLogMessage(embed)
		}
	}
};