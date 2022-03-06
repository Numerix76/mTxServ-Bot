const Discord = require('discord.js');

module.exports = {
	name: 'roles',
	category: 'Admin',
	description: 'Show roles stats.',
	guildOnly: true,
	permissions: ['ADMINISTRATOR'],
	hidden: false,
	slash: 'both',


	callback: async ({ client, message, interaction, args }) => {
		const msg = message || interaction
		
		const embed = new Discord.MessageEmbed()
			.setAuthor(`${client.user.tag}`, `${client.user.displayAvatarURL()}`)
			.setColor('BLUE')
			.setTimestamp();

		const all = (await msg.guild.members.fetch())

		msg.guild.roles.cache.map(async role => {
			const count = all
				.filter(m =>
					m.roles.cache.has(role.id)
				).size
			
			embed.addField(role.name.replace("@everyone", "ALL"), count.toString(), true)
		})

		return embed
	}
};