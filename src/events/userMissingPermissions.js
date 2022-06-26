const { Event } = require("sheweny");
const mTxServUtil = require("../util/mTxServUtil");
const { EmbedBuilder, Colors } = require("discord.js");
const { Constants } = require("sheweny");

module.exports = class UserMissingPermissionsEvent extends Event {
	constructor(client) {
		super(client, Constants.COMMAND_EVENTS.userMissingPerm, {
			description: "User missing permissions",
			once: true,
			emitter: client.managers.commands,
		});
	}

	async execute(interaction, userMissingPerms, command) {
		await interaction.reply("Permission manquante. " + userMissingPerms[0]);
	}
};
