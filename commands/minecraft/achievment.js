const Discord = require('discord.js');
const mTxServUtil = require('../../util/mTxServUtil');
const { ICONS, AchievementCreator } = require("mc-achievements");
const { writeFileSync } = require("fs");

const listIcons = Object.values(ICONS)

module.exports = {
	name: 'mc-achievement',
    aliases: ['achievement'],
	category: 'Minecraft',
	description: 'Create minecraft achievment.',
	permissions: ['SEND_MESSAGES'],
	hidden: false,
	slash: 'both',

	expectedArgs: '<icon> <title> <message>',
	expectedArgsTypes: ['STRING', 'STRING', 'STRING'],

	minArgs: 3,

	callback: async ({ client, message, interaction, args }) => {
		const msg = message || interaction;
		const author = message?message.author:interaction.user
		const lang = require(`../../languages/${await mTxServUtil.resolveLangOfMessage(msg)}.json`);

		const [icon, title] = args

		messageAch = args.slice(2).join(" ")

		if (listIcons.indexOf(icon) === -1) {
            return mTxServUtil.sayError(msg, lang["mc-achivement"]["no_icon"].replace("%icons%", listIcons.map(cur => (`\`${cur}\``)).join(', ')))
        }

        try {
            const binary = await AchievementCreator.create(icon, title, messageAch);

            const attachment = new Discord.MessageAttachment(binary, 'achievment.png');

            const embed = new Discord.MessageEmbed()
                .setColor('GREEN')
                .setDescription(lang["mc-achivement"]["success"])
                .setTimestamp()
                .setImage(`attachment://achievment.png`)
                .setFooter(`${author.tag}`)
            ;

            msg.reply({ embeds: [embed], files: [attachment] })
        } catch (err) {
            console.error(err)
            return mTxServUtil.sayError(msg, lang["mc-achivement"]["error"].replace("%errMessage%", err.message))
        }
	}
};