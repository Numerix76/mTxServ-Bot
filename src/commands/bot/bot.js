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
		const suggest = suggestsConfig ? `<#${suggestsConfig}>` : mTxServUtil.translate(interaction, ["bot_infos", "feedback", "not_configured"]);
		
		const embed = new EmbedBuilder()
			.setAuthor({ name: client.user.tag, iconURL: client.user.displayAvatarURL(), url: mTxServUtil.translate(interaction, ["mtxserv", "link", "home"]) })
			.setColor(Colors.Blue)
			.addFields([
				{
					name: mTxServUtil.translate(interaction, ["bot_infos", "configure", "title"]),
					value: mTxServUtil.translate(interaction, ["bot_infos", "configure", "description"]),
				},
				{
					name: mTxServUtil.translate(interaction, ["bot_infos", "how_to_fork", "title"]),
					value: mTxServUtil.translate(interaction, ["bot_infos", "how_to_fork", "description"]),
				},
				{
					name: mTxServUtil.translate(interaction, ["bot_infos", "home"]),
					value: `[mTxServ.com](https://mtxserv.com)`,
					inline: true
				},
				{
					name: mTxServUtil.translate(interaction, ["bot_infos", "discord", "title"]),
					value: `[${mTxServUtil.translate(interaction, ["bot_infos", "discord", "description"])}](${client.guildInvite})`,
					inline: true
				},
				{
					name: mTxServUtil.translate(interaction, ["bot_infos", "invite", "title"]),
					value: `[${mTxServUtil.translate(interaction, ["bot_infos", "invite", "description"])}](${client.botInvite})`,
					inline: true
				},
				{
					name: mTxServUtil.translate(interaction, ["bot_infos", "source", "title"]),
					value: `[${mTxServUtil.translate(interaction, ["bot_infos", "source", "description"])}](${client.sourceURL})`,
					inline: true
				},
				{
					name: mTxServUtil.translate(interaction, ["bot_infos", "uptime"]),
					value: moment.duration(client.uptime).format('hh:mm:ss', { trim: false }),
					inline: true
				},
				{
					name: mTxServUtil.translate(interaction, ["bot_infos", "memory"]),
					value: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`,
					inline: true
				},
				{
					name: mTxServUtil.translate(interaction, ["bot_infos", "servers"]),
					value: formatNumber(client.guilds.cache.size),
					inline: true
				},
				{
					name: mTxServUtil.translate(interaction, ["bot_infos", "members"]),
					value: formatNumber(memberTotal),
					inline: true
				},
				{
					name: mTxServUtil.translate(interaction, ["bot_infos", "feedback", "title"]),
					value: mTxServUtil.translate(interaction, ["bot_infos", "feedback", "description"], { "suggest": suggest }),
					inline: true
				},
				{
					name: mTxServUtil.translate(interaction, ["bot_infos", "credits", "title"]),
					value: mTxServUtil.translate(interaction, ["bot_infos", "credits", "description"]),
					inline: true
				}
			])
			.setFooter({ text: mTxServUtil.translate(interaction, ["bot_infos", "commands"], { "numberCommands": formatNumber(client.managers.commands.commands.size) }) });

		if(this.parseDependencies().length < 1024) {
			embed.addFields({ name: mTxServUtil.translate(interaction, ["bot_infos", "dependencies"]), value: this.parseDependencies() });
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