const { EmbedBuilder, Colors } = require("discord.js");
const { Event } = require("sheweny");
const mTxServUtil = require("../util/mTxServUtil");

module.exports = class guildCreateEvent extends Event {
	constructor(client) {
		super(client, "guildCreate", {
			description: "Guild joined",
			emitter: client,
		});
	}

	async execute(guild) {
		console.log(`Join the guild ${guild.name} #${guild.id}`);

		if (!guild.ownerId) {
			return;
		}
		
		const owner = await guild.members.fetch(guild.ownerId)
		if (!owner) {
			return;
		}

		const embedWelcome = new EmbedBuilder()
			.setAuthor({ name: client.user.tag, iconURL: client.user.displayAvatarURL(), url: 'https://mtxserv.com' })
			.setColor(Colors.Blue)
			.setDescription(`Thanks for adding me, I successfully joined your server \`${guild.name}\`.\n\n**__Game Server Status__**\nTo enable the command \`/servers\` on your discord server, use \`/config servers add\` to configure it, in a channel.\n\n**__Follow your favorites games__**\nThe bot can post new articles in english or/and french, about your favorites games, in a specified channel. To configure it, use \`/config feeds\` in a channel.`)

		owner
			.send({
				embeds: [embedWelcome]
			})
			.catch((err) => {
				const defaultChannel = Util.getDefaultChannel(guild);
				if (defaultChannel) {
					defaultChannel.send({
						embeds: [embedWelcome]
					})
				}
			});

		const embedLog = new EmbedBuilder()
			.setColor(Colors.Blue)
			.setTitle('Join a new guild')
			.setDescription(`Bot is on a new guild **\`${guild.name.replace('`', '\`')}\`**`)
			.addFields([
				{
					name: 'Owner :', 
					value: owner.user.tag, 
					inline: true
				},
				{
					name: 'Guild ID :', 
					value: `\`${guild.id}\``, 
					inline: true
				},
				{
					name: 'Members :', 
					value: `\`${guild.memberCount}\``, 
					inline: true
				}
			])
			.setTimestamp();

		mTxServUtil.sendLogMessage({ embeds: [embedLog] });
	}
};
