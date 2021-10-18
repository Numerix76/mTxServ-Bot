const Discord = require('discord.js');
const mTxServUtil = require('../../util/mTxServUtil');
const { Permissions } = Discord;


module.exports = {
	name: 'select-games',
	aliases: ['add-role', 'ajouter-jeu'],
	category: 'Admin',
	description: 'Send select games message',
	ownerOnly: true,
	guildOnly: true,
	permissions: ['SEND_MESSAGES'],
	hidden: true,
	slash: false,

	callback: async ({ client, message, interaction, args }) => {
		const msg = message || interaction
		
		const embed = new Discord.MessageEmbed()
			.setAuthor(`${client.user.tag}`, `${client.user.displayAvatarURL()}`)
			.setColor('ORANGE')
			.addField(`🇫🇷 Selectionnez vos jeux`, `Sélectionnez les jeux qui vous interessent **pour voir les channels dédiés**.`)
			.addField(`🇺🇸 Select your games`, `Select the games that interest you **to see related channels**.`)
			.addField('🎮 Games / Jeux', 
			`・⛏ Minecraft (Java)
			・⚒  Minecraft PE / Minecraft Bedrock
			・🚔 Garry's Mod / GMod
			・🦕 ARK
			・🏹 Rust
			・💎 Hytale
			・🤖 Dev PHP / Discord.js
			・🐧 VPS (Linux, Windows)
			・➕ Onset, Arma3, CS:GO
			・⚔ Valheim`)
			.setFooter('Choose your games / Choisissez vos jeux - mTxServ.com');

		msg.delete()

		msg.channel.send({
			embeds: [embed]
		})
	}
};