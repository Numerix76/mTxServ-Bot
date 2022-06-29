
const { formatNumber } = require('../../util/Util');
const { dependencies } = require('../../../package.json');
const moment = require('moment');
require('moment-duration-format');


const { Command, Constants } = require("sheweny");
const mTxServUtil = require("../../util/mTxServUtil");
const { EmbedBuilder, Colors } = require("discord.js");

module.exports = class BotCommand extends Command {
	constructor(client) {
		super(client, {
			name: "bot",
			nameLocalizations: {
				'fr': 'bot'
			},
			description: "Get information about the bot.",
			descriptionLocalizations: {
				'fr': 'Informations à propos du bot.',
			},
			category: "Bot",
			userPermissions: ["SendMessages"],
			channel: Constants.COMMAND_CHANNEL.global,
		});
	}

	async execute(interaction) {	
		const memberTotal = client.guilds.cache.reduce((a, g) => a + g.memberCount, 0);
		const suggestsConfig = await client.provider.get(interaction.guild.id, 'suggest-config', "");
		const suggest = suggestsConfig ? `<#${suggestsConfig}>` : mTxServUtil.translate(interaction, ["bot_infos", "feedback", "not_configured"]); //'__not configured__';       
		
		const embed = new EmbedBuilder()
			.setAuthor({ name: client.user.tag, iconURL: client.user.displayAvatarURL(), url: 'https://mtxserv.com' })
			.setColor(Colors.Blue)
			.addFields([
				{
					name: mTxServUtil.translate(interaction, ["bot_infos", "configure", "title"]), //lang['fork_me']['configure'],
					value: mTxServUtil.translate(interaction, ["bot_infos", "configure", "description"]), //lang['fork_me']['configure_explain']
				},
				{
					name: mTxServUtil.translate(interaction, ["bot_infos", "how_to_fork", "title"]), //lang['fork_me']['how'],
					value: mTxServUtil.translate(interaction, ["bot_infos", "how_to_fork", "description"]), //lang['fork_me']['description']
				},
				{
					name: mTxServUtil.translate(interaction, ["bot_infos", "home"]), //'❯ Home',
					value: `[mTxServ.com](https://mtxserv.com)`,
					inline: true
				},
				{
					name: mTxServUtil.translate(interaction, ["bot_infos", "discord", "title"]), //'❯ Discord',
					value: `[${mTxServUtil.translate(interaction, ["bot_infos", "discord", "description"])}](${client.guildInvite})`, // `[Join us](${client.inviteURL})`,
					inline: true
				},
				{
					name: mTxServUtil.translate(interaction, ["bot_infos", "invite", "title"]), //'❯ Invite Bot',
					value: `[${mTxServUtil.translate(interaction, ["bot_infos", "invite", "description"])}](${client.botInvite})`, //'[Invite the bot](https://discord.com/oauth2/authorize?client_id=535435520394657794&permissions=8&scope=bot%20applications.commands)',
					inline: true
				},
				{
					name: mTxServUtil.translate(interaction, ["bot_infos", "source", "title"]), //'❯ Source Code',
					value: `[${mTxServUtil.translate(interaction, ["bot_infos", "source", "description"])}](${client.sourceURL})`, //'[Numerix76/mTxServ-Bot](https://github.com/Numerix76/mTxServ-Bot)',
					inline: true
				},
				{
					name: mTxServUtil.translate(interaction, ["bot_infos", "uptime"]), //'❯ Uptime',
					value: moment.duration(client.uptime).format('hh:mm:ss', { trim: false }),
					inline: true
				},
				{
					name: mTxServUtil.translate(interaction, ["bot_infos", "memory"]), //'❯ Memory Usage',
					value: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`,
					inline: true
				},
				{
					name: mTxServUtil.translate(interaction, ["bot_infos", "servers"]), //'❯ Servers Discord',
					value: formatNumber(client.guilds.cache.size),
					inline: true
				},
				{
					name: mTxServUtil.translate(interaction, ["bot_infos", "members"]), //'❯ Members Discord',
					value: formatNumber(memberTotal),
					inline: true
				},
				{
					name: mTxServUtil.translate(interaction, ["bot_infos", "feedback", "title"]), //`❯ Feedbacks`,
					value: mTxServUtil.translate(interaction, ["bot_infos", "feedback", "description"], { "suggest": suggest }), //`\`m!suggest-config\` to configure.\n・${suggest}`,
					inline: true
				},
				{
					name: mTxServUtil.translate(interaction, ["bot_infos", "credits", "title"]), //'❯ Credits',
					value: mTxServUtil.translate(interaction, ["bot_infos", "credits", "description"]), //'・Seb\n・Numerix',
					inline: true
				}
			])
			.setFooter({ text: mTxServUtil.translate(interaction, ["bot_infos", "commands"], { "numberCommands": formatNumber(client.managers.commands.commands.size) }) }); //`${formatNumber(instance._commandHandler.commands.length)} commands - by mTxServ.com` });

		if(this.parseDependencies().length < 1024) {
			embed.addFields({ name: mTxServUtil.translate(interaction, ["bot_infos", "dependencies"]) /*'❯ Dependencies'*/, value: this.parseDependencies() });
		} else {
			let dep = this.parseDependencies().split(', ');
			let first = [];
			let second = [];
			let count = 1;
			while(String(first).length < 1024 && dep.length !== 0) {
				if(String(first).length > 900) {
					embed.addField({ name: `${mTxServUtil.translate(interaction, ["bot_infos", "dependencies"])} (${count})`, value: first.join(', ') });
					second = first;
					first = [];
					count++;
				} else {
					first.push(dep.shift())
				}
			}
			if(first !== second && first.length !== 0) embed.addField({ name: `${mTxServUtil.translate(interaction, ["bot_infos", "dependencies"])} (${count})`, value: first.join(', ') });
		}

		await interaction.reply({
			embeds: [embed]
		});
	}

	parseDependencies() {
		return Object.entries(dependencies).map(dep => {
			if (dep[1].startsWith('github:')) {
				const repo = dep[1].replace('github:', '').split('/');
				return `[${dep[0]}](https://github.com/${repo[0]}/${repo[1].replace(/#.+/, '')})`;
			}
			return `[${dep[0]}](https://npmjs.com/${dep[0]})`;
		}).join(', ');
	}
}

/*module.exports = {
	name: 'bot',
	aliases: ['bot-status', 'info', 'bot-info', 'bot', 'fork', 'forkme', 'bot-invite'],
	category: 'Bot',
	guildOnly: true,
	description: 'Display bot infos.',
	permissions: ['SEND_MESSAGES'],
	slash: 'both',

	callback: async ({ client, message, interaction, args, instance }) => {
		const msg = message || interaction;
		
		const lang = require(`../../languages/${await mTxServUtil.resolveLangOfMessage(msg)}.json`)
		const memberTotal = client.guilds.cache.reduce((a, g) => a + g.memberCount, 0)        
		const languageGuild = await client.provider.get(msg.guild.id, 'language', process.env.DEFAULT_LANG)

		const embed = new Discord.MessageEmbed()
			.setAuthor(`${client.user.tag}`, `${client.user.displayAvatarURL()}`, 'https://mtxserv.com')
			.setColor('BLUE')
			.addField(lang['fork_me']['configure'], lang['fork_me']['configure_explain'])
			.addField(lang['fork_me']['how'], lang['fork_me']['description'])
			.addField('❯ Home', `[mTxServ.com](https://mtxserv.com)`, true)
			.addField('❯ Discord', `[Join us](${client.inviteURL})`, true)
			.addField('❯ Invite Bot', '[Invite the bot](https://discord.com/oauth2/authorize?client_id=535435520394657794&permissions=8&scope=bot%20applications.commands)', true)
			.addField('❯ Source Code', '[Numerix76/Bot-mTxServ-V2](https://github.com/Numerix76/Bot-mTxServ-V2)', true)
			.addField('❯ Uptime', moment.duration(client.uptime).format('hh:mm:ss', { trim: false }), true)
			.addField('❯ Language', `:flag_${languageGuild == 'en' ? 'us' : languageGuild}:`, true)
			.addField('❯ Memory Usage', `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`, true)
			.addField('❯ Servers Discord', formatNumber(client.guilds.cache.size), true)
			.addField('❯ Members Discord', formatNumber(memberTotal), true)
			.setFooter(`${formatNumber(instance._commandHandler.commands.length)} commands - by mTxServ.com`)
		;

		const suggestsConfig = await client.provider.get(msg.guild.id, 'suggest-config', "")
		const suggest = suggestsConfig ? `<#${suggestsConfig}>` : '__not configured__'

		embed.addField(`❯ Feedbacks`, `\`m!suggest-config\` to configure.\n・${suggest}`, true)
		embed.addField('❯ Credits', '・Seb\n・Numerix', true)

		if(module.exports.parseDependencies().length < 1024) {
			embed.addField('❯ Dependencies', module.exports.parseDependencies());
		} else {
			let dep = module.exports.parseDependencies().split(', ');
			let first = [];
			let second = [];
			let count = 1;
			while(String(first).length < 1024 && dep.length !== 0) {
				if(String(first).length > 900) {
					embed.addField(`❯ Dependencies (${count})`, first.join(', '));
					second = first;
					first = [];
					count++;
				} else {
					first.push(dep.shift())
				}
			}
			if(first !== second && first.length !== 0) embed.addField(`❯ Dependencies (${count})`, first.join(', '));
		}

		return embed
	},

	parseDependencies() {
		return Object.entries(dependencies).map(dep => {
			if (dep[1].startsWith('github:')) {
				const repo = dep[1].replace('github:', '').split('/');
				return `[${dep[0]}](https://github.com/${repo[0]}/${repo[1].replace(/#.+/, '')})`;
			}
			return `[${dep[0]}](https://npmjs.com/${dep[0]})`;
		}).join(', ');
	}
};*/
