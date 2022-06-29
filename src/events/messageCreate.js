const { ChannelType } = require("discord.js");
const { Event } = require("sheweny");
const mTxServApi = require("../api/mTxServApi.js");

module.exports = class messageCreateEvent extends Event {
	constructor(client) {
		super(client, "messageCreate", {
			description: "Mesage created",
			emitter: client,
		});
	}

	async execute(msg) {
		const authorizeChannel = [ChannelType.GuildForum, ChannelType.GuildPrivateThread, ChannelType.GuildPublicThread, ChannelType.GuildText];

		if (authorizeChannel.indexOf(msg.channel.type) === -1) return;
		if (msg.author.bot) return;
		if ( isDev ) return;
		if ( !client.isMainGuild(msg.guild.id) ) return;

		/*------------------*/
		/* Ranker system    */
		/*------------------*/
		if ( msg.member.displayName ) {
			client.ranker.processMessage(msg);
		}

		/*--------------------*/
		/* mTxServ user role  */
		/*--------------------*/
		const mTxServUserApi = new mTxServApi()
		const roleMtxServ = '773540951434985503';
		if ( await mTxServUserApi.isAuthenticated(msg.author.id) ) 
		{
			const role = await msg.guild.roles.fetch(roleMtxServ)
			if (role && !msg.member.roles.cache.has(role.id)) {
				msg.member.roles.add(role).catch(console.error);
			}
		}

		/*----------------------*/
		/* GameServer user role */
		/*----------------------*/
		const roleGameServ = '773500803218538546'
		if ( -1 !== msg.channel.name.indexOf('serveurs') || -1 !== msg.channel.name.indexOf('servers') )
		{
			const role = await msg.guild.roles.fetch(roleGameServ)
			if ( role && !msg.member.roles.cache.has(role.id) ) {
				msg.member.roles.add(role).catch(console.error);
			}
		}
	}
};
