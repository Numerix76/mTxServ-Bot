const Discord = require('discord.js');
const mTxServUtil = require('../../util/mTxServUtil');
const { formatNumber } = require('../../util/Util');
const { dependencies } = require('../../package.json');
const moment = require('moment');
require('moment-duration-format');

module.exports = {
	name: 'bot',
	aliases: ['bot-status', 'info', 'bot-info', 'bot', 'fork', 'forkme', 'bot-invite'],
	category: 'Bot',
	description: 'Display bot infos.',
	permissions: ['SEND_MESSAGES'],
	slash: 'both',

	callback: async ({ client, message, interaction, args, instance }) => {
		const msg = message || interaction;
		
		if (msg.channel.type === 'DM') return;
        
        const lang = require(`../../languages/${await mTxServUtil.resolveLangOfMessage(msg)}.json`)
        const memberTotal = client.guilds.cache.reduce((a, g) => a + g.memberCount, 0)        
       	const languageGuild = await client.provider.get(msg.guild.id, 'language', process.env.DEFAULT_LANG)

        const embed = new Discord.MessageEmbed()
            .setAuthor(`${client.user.tag}`, `${client.user.displayAvatarURL()}`, 'https://mtxserv.com')
            .setColor('BLUE')
            .addField(lang['fork_me']['configure'], lang['fork_me']['configure_explain'])
            .addField(lang['fork_me']['how'], lang['fork_me']['description'])
            .addField('❯ Home', `[mTxServ.com](https://mtxserv.com)`, true)
            .addField('❯ Discord', `[Join us](${client.options.invite})`, true)
            .addField('❯ Invite Bot', '[Invite the bot](https://discord.com/oauth2/authorize?client_id=535435520394657794&permissions=912577&scope=bot)', true)
            .addField('❯ Source Code', '[mTxServ/ElDictator](https://github.com/mTxServ/ElDictator)', true)
            .addField('❯ Uptime', moment.duration(client.uptime).format('hh:mm:ss', { trim: false }), true)
            .addField('❯ Language', `:flag_${languageGuild == 'fr' ? languageGuild : 'us'}:`, true)
            .addField('❯ Memory Usage', `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`, true)
            .addField('❯ Servers Discord', formatNumber(client.guilds.cache.size), true)
            .addField('❯ Members Discord', formatNumber(memberTotal), true)
            .setFooter(`${formatNumber(instance._commandHandler.commands.length)} commands - by mTxServ.com`)
        ;

        const suggestsConfig = await client.provider.get(msg.guild.id, 'suggest-config', {})
        const suggestFr = suggestsConfig['fr'] ? `:flag_fr: <#${suggestsConfig['fr']}>` : ':flag_fr: __not configured__'
        const suggestEn = suggestsConfig['en'] ? `:flag_us: <#${suggestsConfig['en']}>` : ':flag_us: __not configured__'

        embed.addField(`❯ Feedbacks`, `\`m!suggest-set-channel\` to configure.\n・${suggestFr}\n・${suggestEn}`, true)

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

        msg.reply({
            embeds : [embed]
        });
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
};
