const { Event } = require("sheweny");
const mTxServUtil = require("../util/mTxServUtil");
const { EmbedBuilder, Colors, ChannelType } = require("discord.js");
const { Constants } = require("sheweny");

module.exports = class messageCreateEvent extends Event {
	constructor(client) {
		super(client, "messageCreate", {
			description: "Mesage created",
			emitter: client,
		});
	}

	async execute(msg) {
		if (msg.channel.type !== ChannelType.GuildText) return;
		if (msg.author.bot) return;
		if ( isDev ) return;
		if ( !client.isMainGuild(msg.guild.id) ) return;

		/*------------------*/
		/* Ranker system    */
		/*------------------*/
		if ( msg.member.displayName ) {
			client.ranker.processMessage(msg);
		}
	}
};
