const Discord = require('discord.js');
const mTxServUtil = require('../../util/mTxServUtil');


module.exports = {
	name: 'stock',
    aliases: ['stocks'],
	category: 'mTxServ',
	description: 'Get Stock of mTxServ.',
	permissions: ['SEND_MESSAGES'],
	slash: 'both',

	expectedArgs: "<type>",
	expectedArgsTypes: ['STRING'],

	minArgs: 1,
	maxArgs: 1,

	options: [
		{
		  name: 'type',
		  description: 'Which type of stock (game/vps-game/vps)?',
		  required: true,
		  type: 'STRING',
		  choices: [
				{
					name: "Game",
					value: "game"
				},
			 	{
					name: "VPS-Game",
					value: "vps-game"
				},
				{
					name: "VPS",
					value: "vps"
				},
		  ]
		},
	],

	callback: async ({ client, message, interaction, args }) => {
		const msg = message || interaction;
		const lang = require(`../../languages/${await mTxServUtil.resolveLangOfMessage(msg)}.json`);
		
		const [type] = args

		const pop = [
            {
                icon: ':flag_fr:',
                hasGameStock: true,
                hasVpsGameStock: true,
                hasVpsStock: true
            },
            {
                icon: ':flag_gb:',
                hasGameStock: false,
                hasVpsGameStock: true,
                hasVpsStock: false
            },
            {
                icon: ':flag_de:',
                hasGameStock: false,
                hasVpsGameStock: false,
                hasVpsStock: false
            },
            {
                icon: ':flag_pl:',
                hasGameStock: false,
                hasVpsGameStock: false,
                hasVpsStock: false
            },
            {
                icon: ':flag_ca:',
                hasGameStock: true,
                hasVpsGameStock: true,
                hasVpsStock: false
            },
            {
                icon: ':flag_us:',
                hasGameStock: true,
                hasVpsGameStock: true,
                hasVpsStock: false
            },
        ];

        let embed = null

        switch (type) {
            // Game Stock
            case 'game':
                embed = new Discord.MessageEmbed()
                    .setTitle(lang['stock']['title_game'])
                    .setDescription(lang['stock']['state'])
                    .setColor('GREEN')
                ;

                for (const k in pop) {
                    embed.addField(pop[k].icon, pop[k].hasGameStock ? ':green_circle:' : ':red_circle:', true)
                }

				break

            // VPS Game Stock
            case 'vps-game':
                embed = new Discord.MessageEmbed()
                    .setTitle(lang['stock']['title_vps_game'])
                    .setDescription(lang['stock']['state'])
                    .setColor('GREEN')
                ;

                for (const k in pop) {
                    embed.addField(pop[k].icon, pop[k].hasVpsGameStock ? ':green_circle:' : ':red_circle:', true)
                }

                break

            // VPS stock
            case 'vps':
                embed = new Discord.MessageEmbed()
                    .setTitle(lang['stock']['title_vps'])
                    .setDescription(lang['stock']['state'])
                    .setColor('RED')
                ;

				for (const k in pop) {
					embed.addField(pop[k].icon, pop[k].hasVpsStock ? ':green_circle:' : ':red_circle:', true)
				}

				break
			
			default:
				embed = mTxServUtil.sayError(msg, lang["stock"]["error"])

				break
        	}
		
		return embed
	},
};
