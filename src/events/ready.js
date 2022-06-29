const { Event } = require("sheweny");
const mTxServUtil = require("../util/mTxServUtil");
const { EmbedBuilder, Colors } = require("discord.js");

module.exports = class ReadyEvent extends Event {
	constructor(client) {
		super(client, "ready", {
			description: "Client is logged in",
			once: true,
			emitter: client,
		});
	}

	execute() {
		console.log(`Logged in as ${this.client.user.tag}! (${this.client.user.id})`);

		this.client.feedMonitor.warmup()
		this.client.statusUpdater.updateStatus()

		setInterval(() => this.client.statusUpdater.updateStatus(), 1000 * 60)

		setInterval(async () => {
			this.client.statusMonitor.process()
			this.client.feedMonitor.process()
		}, 1000 * 60 * 10);
	
		const embed = new EmbedBuilder()
			.setAuthor({
				name: client.user.tag, 
				iconURL: client.user.displayAvatarURL()
			})
			.setColor(Colors.Green)
			.setTitle(":green_circle: Bot is online")
			.setTimestamp();

		mTxServUtil.sendLogMessage({
			embeds: [embed]
		})

		console.log(`${client.user.tag} is ready!`);
	}
};
