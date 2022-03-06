const Discord = require('discord.js');
const mTxServUtil = require('../../util/mTxServUtil');


module.exports = {
	name: 'suggest-config',
    aliases: [],
	category: 'suggest',
	description: 'Set suggests channels.',
	permissions: ['ADMINISTRATOR'],
	slash: 'both',
	guildOnly: true,

	expectedArgs: "<channel>",
	expectedArgsTypes: ['CHANNEL'],

	minArgs: 1,
	maxArgs: 1,

	options: [
		{
			name: 'channel',
			description: 'Which channel used to post suggestion?',
			required: true,
			type: 'CHANNEL',
		},
	],

	callback: async ({ client, message, interaction, args }) => {
		const msg = message || interaction;
		const lang = require(`../../languages/${await mTxServUtil.resolveLangOfMessage(msg)}.json`);
		
		const channel = (message? message.mentions.channels.first() : interaction.options.getChannel("channel"))
        await client.provider.set(channel.guild.id, 'suggest-config', channel.id)

        return mTxServUtil.saySuccess(msg, `The suggestion channel has been set to \`${channel.name}\`.`)
    }
};
