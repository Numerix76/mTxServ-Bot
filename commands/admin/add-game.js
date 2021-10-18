const Discord = require('discord.js');
const mTxServUtil = require('../../util/mTxServUtil');
const { Permissions } = Discord


// /!\ Actuellement n'importe qui peut utiliser via slash
module.exports = {
	name: 'add-game',
	aliases: ['add-role', 'ajouter-jeu'],
	category: 'Admin',
	description: 'Add a new game on the discord.',
	ownerOnly: true,
	guildOnly: true,
	permissions: ['ADMINISTRATOR'],
	hidden: false,
	slash: false,

	expectedArgs: '<game> <color> <emoji> <other>',
	expectedArgsTypes: ['STRING', 'STRING', 'STRING', 'BOOLEAN'],
    
    minArgs: 4,
    maxArgs: 4,	
	

	callback: async ({ client, message, interaction, args }) => {
		const msg = message ||interaction

		const [game, color, emoji, other]  = args
		
		if ( msg.channel.type === 'DM' ) {
			return msg.reply(`This command is only available is server`)
		}

		const roleMod = '895391623419162674';
		const roleFRPos = msg.guild.roles.cache.find(r => r.name === "FR").position

		let roleFRID;
		let roleENID;

		/*-----------------------*/
		/* Création role FR      */
		/*-----------------------*/

		await msg.guild.roles.create({
			name: "[FR] " + game + " " + emoji,
			color: color,
			permissions:
			[
				Permissions.FLAGS.ADD_REACTIONS,
				Permissions.FLAGS.STREAM,
				Permissions.FLAGS.EMBED_LINKS,
				Permissions.FLAGS.ATTACH_FILES,
				Permissions.FLAGS.READ_MESSAGE_HISTORY,
				Permissions.FLAGS.USE_EXTERNAL_EMOJIS,
				Permissions.FLAGS.CONNECT,
				Permissions.FLAGS.SPEAK,
				Permissions.FLAGS.USE_VAD,
				Permissions.FLAGS.SEND_MESSAGES,
			],
			mentionable: false,
			hoist: false,
			position: roleFRPos+1
		})
		.then(role => roleFRID = role.id)
		.catch(console.error);


		/*-----------------------*/
		/* Création role EN      */
		/*-----------------------*/

		await msg.guild.roles.create({
			name: "[EN] " + game + " " + emoji,
			color: color,
			permissions:
			[
				Permissions.FLAGS.ADD_REACTIONS,
				Permissions.FLAGS.STREAM,
				Permissions.FLAGS.EMBED_LINKS,
				Permissions.FLAGS.ATTACH_FILES,
				Permissions.FLAGS.READ_MESSAGE_HISTORY,
				Permissions.FLAGS.USE_EXTERNAL_EMOJIS,
				Permissions.FLAGS.CONNECT,
				Permissions.FLAGS.SPEAK,
				Permissions.FLAGS.USE_VAD,
				Permissions.FLAGS.SEND_MESSAGES,
			],
			mentionable: false,
			hoist: false,
			position: roleFRPos+1
		})
		.then(role => roleENID = role.id)
		.catch(console.error);


		if ( other === 'false' )
		{
			let catFRID;
			let catENID;

			/*-----------------------*/
			/* Création catégorie FR */
			/*-----------------------*/

			await msg.guild.channels.create("[FR] " + game + " " + emoji, { type: 'GUILD_CATEGORY', })
				.then(channel => {
					channel.permissionOverwrites.create(msg.guild.roles.everyone, {
						VIEW_CHANNEL          : false,
					})

					channel.permissionOverwrites.create(roleFRID, {
						VIEW_CHANNEL          : true,
					})

					channel.permissionOverwrites.create(roleMod, {
						VIEW_CHANNEL          : true,
					})

					catFRID = channel.id;
				})
				.catch(console.error);
		

			/*-----------------------*/
			/* Création catégorie EN */
			/*-----------------------*/

			await msg.guild.channels.create("[EN] " + game + " " + emoji, { type: 'GUILD_CATEGORY', })
				.then(channel => {
					channel.permissionOverwrites.create(msg.guild.roles.everyone, {
						VIEW_CHANNEL          : false,
					})

					channel.permissionOverwrites.create(roleENID, {
						VIEW_CHANNEL           : true,
					})

					channel.permissionOverwrites.create(roleMod, {
						VIEW_CHANNEL          : true,
					})

					catENID = channel.id;
				})
				.catch(console.error);

			/*-----------------------*/
			/* Création channels FR  */
			/*-----------------------*/

			await msg.guild.channels.create("nouveautés" + "-" + game.toLowerCase(), { type: 'GUILD_NEWS', })
				.then( async channel => {
					await channel.setParent(catFRID);

					channel.permissionOverwrites.create(msg.guild.roles.everyone, {
						VIEW_CHANNEL          : false,
						SEND_MESSAGES         : false,
						EMBED_LINKS           : false,
						ATTACH_FILES          : false,
					})

					channel.permissionOverwrites.create(roleFRID, {
						VIEW_CHANNEL          : true,
					})

					channel.permissionOverwrites.create(roleMod, {
						VIEW_CHANNEL          : true,
					})
				})
				.catch(console.error);

			const tabChanFR = ["discussion", "entraide", "serveurs"];

			tabChanFR.forEach( async name => {
				await msg.guild.channels.create(name + "-" + game.toLowerCase(), { type: 'GUILD_TEXT', })
					.then( async channel => {
						await channel.setParent(catFRID);
						await channel.lockPermissions();

						if (name === "serveurs" + "-" + game.toLowerCase())
							await channel.setRateLimitPerUser(6*60*60 , "slowmode");
					})
					.catch(console.error);
			});

			await msg.guild.channels.create(game + " #1", { type: 'GUILD_VOICE', })
					.then( async channel => {
						await channel.setParent(catFRID);
						await channel.lockPermissions();
					})
					.catch(console.error);


			/*-----------------------*/
			/* Création channels EN  */
			/*-----------------------*/

			await msg.guild.channels.create("news" + "-" + game.toLowerCase(), { type: 'GUILD_NEWS' })
				.then( async channel => {
					await channel.setParent(catENID);

					channel.permissionOverwrites.create(msg.guild.roles.everyone, {
						VIEW_CHANNEL          : false,
						SEND_MESSAGES         : false,
						EMBED_LINKS           : false,
						ATTACH_FILES          : false,
					})

					channel.permissionOverwrites.create(roleENID, {
						VIEW_CHANNEL          : true,
					})

					channel.permissionOverwrites.create(roleMod, {
						VIEW_CHANNEL          : true,
					})
				})
				.catch(console.error);

			const tabChanEN = ["discussion", "help", "servers"];

			tabChanEN.forEach( async name => {
				await msg.guild.channels.create(name + "-" + game.toLowerCase(), { type: 'GUILD_TEXT', })
					.then( async channel => {
						await channel.setParent(catENID);
						await channel.lockPermissions();

						if (name === "servers" + "-" + game.toLowerCase())
							await channel.setRateLimitPerUser(6*60*60 , "slowmode");
					})
					.catch(console.error);
			});

			await msg.guild.channels.create(game + " #1", { type: 'GUILD_VOICE', })
					.then( async channel => {
						await channel.setParent(catENID);
						await channel.lockPermissions();
					})
					.catch(console.error);
		}
		else
		{
			/*-----------------------*/
			/* Création channels FR  */
			/*-----------------------*/
			let chanFRID
			const catOtherFR = '895390870176673822'
			await msg.guild.channels.create(game.toLowerCase(), { type: 'GUILD_TEXT', })
				.then( async channel => {
					await channel.setParent(catOtherFR);
					
					channel.permissionOverwrites.create(roleFRID, {
						VIEW_CHANNEL          : true,
					})

					channel.permissionOverwrites.create(roleMod, {
						VIEW_CHANNEL          : true,
					})

					chanFRID = channel.id
					
				})
				.catch(console.error);

			/*-----------------------*/
			/* Création channels EN  */
			/*-----------------------*/
			let chanENID
			const catOtherEN = '895390907426287616'
			await msg.guild.channels.create(game.toLowerCase(), { type: 'GUILD_TEXT', })
				.then( async channel => {
					await channel.setParent(catOtherEN);
					
					channel.permissionOverwrites.create(roleENID, {
						VIEW_CHANNEL          : true,
					})

					channel.permissionOverwrites.create(roleMod, {
						VIEW_CHANNEL          : true,
					})

					chanENID = channel.id
					
				})
				.catch(console.error);
		}


		/*---------------------------------------*/
		/* Mise à jour perm catégorie général FR */
		/*---------------------------------------*/

		/*const tabCatFR = ['769556888463081492', '806861259290574849']

		tabCatFR.forEach( async id => {
			await msg.guild.channels.cache.get(id).permissionOverwrites.create(roleFRID, {
				VIEW_CHANNEL          : true,
			})
		});

		const tabChanAdminFR = ['563310350611775498', '772911282390433812', '767487492571004960'];

		tabChanAdminFR.forEach( async id => {
			await msg.guild.channels.cache.get(id).permissionOverwrites.create(roleFRID, {
				VIEW_CHANNEL          : true,
			})
		})*/

		/*---------------------------------------*/
		/* Mise à jour perm catégorie général EN */
		/*---------------------------------------*/

		/*const tabCatEN = ['837787904817889350']

		tabCatEN.forEach( async id => {
			await msg.guild.channels.cache.get(id).permissionOverwrites.create(roleENID, {
				VIEW_CHANNEL          : true,
			})
		});


		const tabChanAdminEN = ['837788054450208869', '837788082836209725'];

		tabChanAdminEN.forEach( async id => {
			await msg.guild.channels.cache.get(id).permissionOverwrites.create(roleENID, {
				VIEW_CHANNEL          : true,
			})
		});*/

		return mTxServUtil.saySuccess(msg, `\`${game} ${emoji}\`` + ' role and channel added successfuly.')
	}
};