const Discord = require('discord.js');
const mTxServUtil = require('../../util/mTxServUtil');
const { MessageActionRow, MessageButton, Permissions } = require("discord.js");

module.exports = {
	name: 'suggest',
    aliases: [],
	category: 'suggest',
	description: 'Submit a feedback',
	permissions: ['SEND_MESSAGES'],
	slash: 'both',
	guildOnly: true,

	expectedArgs: "<suggestion>",
	expectedArgsTypes: ['STRING'],

	minArgs: 1,

	init: async (client) => {
		client.on('interactionCreate', async (interaction) => {
			if (!interaction.isButton()) {
				return
			}

			const { customId, values, member, message } = interaction
			if (customId.indexOf('suggest_') !== -1 && member instanceof Discord.GuildMember)
			{
				const lang = require(`../../languages/${await mTxServUtil.resolveLangOfMessage(msg)}.json`);

				if (!member.permissions.has(Permissions.FLAGS.ADMINISTRATOR))
				{
					interaction.reply({
						content: lang["suggest"]["update-noaccess"],
						ephemeral: true
					})

					return;
				}

				const color = { "accepted": "ORANGE", "refused": "RED", "implemented": "GREEN" }
				const embed = message.embeds[0];
				embed.setColor( color[customId.split("suggest_")[1]] )
				embed.fields[2].value = customId.split("suggest_")[1]

				if ( customId.indexOf("refused") === -1)
				{
					if ( embed.fields.length === 4)
						embed.fields.pop(); // on retire la raison

					message.edit({
						embeds: [embed]
					})
					
					interaction.reply({
						content: lang["suggest"]["update-succes"],
						ephemeral: true
					})

					return;
				}

				interaction.reply({
					embeds: [mTxServUtil.ask(message, lang["suggest"]["ask_reason"])],
					ephemeral: true
				})
		
				const filter = m => m.author.id === member.id
				const collector = message.channel.createMessageCollector({
					filter,
					max: 1,
					time: 40_000, 
					errors: ['time'] 
				})
				
				collector.on('collect', msg => {
					if ( embed.fields.length >= 3)
						embed.fields[3] = {name: lang["suggest"]["reason"], value: msg.content}

					message.edit({
						embeds: [embed]
					})
					
					interaction.editReply({
						embeds: [],
						content: lang["suggest"]["update-succes"],
						ephemeral: true
					})

					msg.delete();
				})
			}
		})
	},

	callback: async ({ client, message, interaction, args }) => {
		const msg = message || interaction;
		const author = msg.author?msg.author:msg.user
		const lang = require(`../../languages/${await mTxServUtil.resolveLangOfMessage(msg)}.json`);
		
		const suggestion = args.join(" ")

		const currentConfig = await client.provider.get(msg.guild.id, 'suggest-config', "")

		if (typeof currentConfig === "" || !client.channels.cache.has(currentConfig)) {
            return mTxServUtil.sayError(msg, `The feedback channel doesn't exist. Use \`m!suggest-config\` to configure it.`)
		}

        const embed = new Discord.MessageEmbed()
            .setAuthor(`${author.tag}`, `${author.displayAvatarURL()}`)
            .setColor('DARK_BLUE')
            .setDescription(Discord.Util.removeMentions(suggestion.trim()))
            .setTimestamp();

        if (msg.channel.type !== 'DM') {
            embed
                .addField('Guild', `${msg.guild.name}`, true)
                .addField('Channel', `${msg.channel.name}`, true)
				.addField('Status', `waiting`, true)
            ;
        }

		const row = new MessageActionRow()
		.addComponents(
			new MessageButton()
				.setCustomId('suggest_accepted')
				.setLabel("Accept")
				.setStyle('PRIMARY')
		)
		.addComponents(
			new MessageButton()
			.setCustomId('suggest_refused')
				.setLabel("Refuse")
				.setStyle('DANGER')
		)
		.addComponents(
			new MessageButton()
			.setCustomId('suggest_implemented')
				.setLabel("Implemente")
				.setStyle('SUCCESS')
		)

        const resMes = await client.channels.cache
            .get(currentConfig)
            .send({ 
				embeds: [embed],
				components: [row]
			})
        ;

		resMes.channel.threads.create({
			name: `Suggestion of ${author.tag}`,
			startMessage: resMes
		})

        return mTxServUtil.saySuccess(msg, lang['suggest']['confirm'].replace('%name%', `<@${author.id}>`))
    }
};
