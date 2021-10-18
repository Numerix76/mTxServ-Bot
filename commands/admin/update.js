const Discord = require('discord.js');
const mTxServUtil = require('../../util/mTxServUtil');
const { execSync } = require('child_process');


module.exports = {
	name: 'update',
	aliases: ['update-bot'],
	category: 'Admin',
	description: 'Update the bot.',
	ownerOnly: true,
	guildOnly: true,
	permissions: ['SEND_MESSAGES'],
	hidden: true,
	slash: false,

	callback: async ({ client, message, interaction, args }) => {
		const msg = message || interaction;
		const lang = require(`../../languages/${await mTxServUtil.resolveLangOfMessage(msg)}.json`);

		mTxServUtil
			.sayWarning(msg, lang['bot_update']['confirm'])
			.then(() => {
				const results = module.exports.exec('git pull && npm install --silent');

				const embed = new Discord.MessageEmbed()
					.setAuthor(`${client.user.tag}`, `${client.user.displayAvatarURL()}`)
					.setColor(results.err ? 'RED' : 'GREEN')
					.setTitle(`:up: Updating bot..`)
					.setDescription(`\`\`\`sh\n${results.std}\n\`\`\``)
					.setTimestamp();

				if ( msg.channel.id !== process.env.LOG_CHANNEL_ID)
					mTxServUtil.sendLogMessage(embed)

				msg.reply({
					embeds : [embed]
				});
			})
	},

	exec(command) {
		try {
			const stdout = execSync(command, { timeout: 30000, encoding: 'utf8' });
			return { err: false, std: stdout.trim() };
		} catch (err) {
			return { err: true, std: err.stderr.trim() };
		}
	}
};
