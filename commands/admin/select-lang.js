const Discord = require('discord.js');


module.exports = {
	name: 'select-lang',
	aliases: ['add-role', 'ajouter-jeu'],
	category: 'Admin',
	description: 'Send select language message',
	ownerOnly: true,
	guildOnly: true,
	permissions: ['SEND_MESSAGES'],
	hidden: true,
	slash: false,

	callback: async ({ client, message, interaction, args }) => {
		const msg = message || interaction

		const iconFr = msg.guild.emojis.cache.find(emoji => emoji.name === 'fr') || ":flag_fr:";
        const iconEn = msg.guild.emojis.cache.find(emoji => emoji.name === 'en') || ":flag_us:";
		
		const embed = new Discord.MessageEmbed()
			.setAuthor(`${client.user.tag}`, `${client.user.displayAvatarURL()}`)
			.setColor('ORANGE')
			.addField(`${iconFr} Bienvenue sur mTxServ!`, `Vous parlez Français? **Cliquez sur :flag_fr:** pour activer les sections françaises.`)
			.addField(`${iconEn} Welcome on mTxServ!`, `Do you speak English? **Click :flag_us:** to see english sections.`)
			.setFooter('Choose your language / Choisissez votre langue - mTxServ.com');

		const langMsg = await msg.channel.send({
			embeds: [embed]
		})

		msg.delete()
		
		langMsg.react('🇫🇷')
		langMsg.react('🇺🇸')
	}
};