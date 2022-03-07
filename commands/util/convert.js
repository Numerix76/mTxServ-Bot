const Discord = require('discord.js');
const mTxServUtil = require('../../util/mTxServUtil');
const ConverterApi = require('../../api/ConverterApi.js')

module.exports = {
	name: 'convert',
    aliases: [],
	category: 'Util',
	description: 'Convert Youtube Videos or SoundCloud Music to a format',
	permissions: ['SEND_MESSAGES'],
	slash: 'both',

	expectedArgs: "<url> <format>",
	expectedArgsTypes: ['STRING', 'STRING'],

	minArgs: 2,
	maxArgs: 2,

	options: [
		{
		  name: 'url',
		  description: 'Which url do you want to convert?',
		  required: true,
		  type: 'STRING',
		},
		{
			name: 'format',
			description: 'In which format?',
			required: true,
			type: 'STRING',
		  	choices: [
				{
					name: "MP3",
					value: "mp3"
				},
			 	{
					name: "MP4",
					value: "mp4"
				},
				{
					name: "WebM",
					value: "webm"
				}
		  	]
		}
	],

	callback: async ({ client, message, interaction, args }) => {
		const msg = message || interaction;
		const lang = require(`../../languages/${await mTxServUtil.resolveLangOfMessage(msg)}.json`);
		
		const formats = ['mp3', 'mp4', 'webm']
		
		const [url, format] = args

		if (formats.indexOf(format) === -1) {
			return mTxServUtil.sayError(msg, lang["convert"]["invalid_format"]) // a changer
		}

		const embed = new Discord.MessageEmbed()
            .setTitle(lang["convert"]["conversion_of"].replace("%url%", url))
            .setColor('BLUE')
            .setTimestamp()
        ;

		const reply = await msg.reply({
			embeds: [embed]
		})

        const api = new ConverterApi(url, format, lang, reply, interaction)
		api.convert()
    }
};
