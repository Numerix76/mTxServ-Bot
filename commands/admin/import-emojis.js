const Discord = require('discord.js');
const mTxServUtil = require('../../util/mTxServUtil');
const path = require('path');
const fs = require('fs');


module.exports = {
	name: 'import-emojis',
	aliases: [],
	category: 'Admin',
	description: 'Import et synchronised all emojis available with the bot.',
	ownerOnly: false,
	guildOnly: true,
	permissions: ['SEND_MESSAGES', 'MANAGE_EMOJIS', 'USE_EXTERNAL_EMOJIS'],
	hidden: false,
	slash: 'both',

	callback: async ({ client, message, interaction, args }) => {
		const msg = message ||interaction
		const lang = require(`../../languages/${args[0]}.json`);
		const emojiDirectory = path.join(__dirname, '../../emojis')
		console.log(`List emojis in directory '${emojiDirectory}'`)

		fs.readdir(emojiDirectory, (err, files) => {
			if (err) return console.error(err);

			files.forEach((file) => {
				if (file.indexOf('.png') === -1) return

				const filePath = `${emojiDirectory}/${file}`
				const emojiName = file.replace('.png', '')
				const isAlreadyAdded = msg.guild.emojis.cache.some(emoji => emoji.name === emojiName)

				if (!isAlreadyAdded) {
					console.log(`added emoji ${filePath}`)
					msg.guild.emojis.create(filePath, emojiName).catch(console.log)
				}
			});
		});

		return mTxServUtil.saySuccess(msg, lang["import-emojis"]["success"])
	}
};