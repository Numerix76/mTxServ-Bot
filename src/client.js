const { ActivityType } = require("discord.js");
const { ShewenyClient } = require("sheweny");
const FirebaseProvider = require('./provider/FirebaseProvider');
const FeedMonitor = require("./services/FeedMonitor");
const Ranker = require("./services/Ranker");
const StatusMonitor = require("./services/StatusMonitor");
const StatusUpdater = require("./services/StatusUpdater");

class mTxServClient extends ShewenyClient {
	constructor(options, clientOptions)
	{
		super(options, clientOptions);

		this.feedMonitor = new FeedMonitor(options.feeds);
		this.statusMonitor = new StatusMonitor(options.statusURL);
		this.ranker = new Ranker();

		this.statusUpdater = new StatusUpdater(this, [
			{ type: ActivityType.Watching, name: `${options.managers.commands.prefix}giveaway | Win prizes!`},
			{ type: ActivityType.Playing , name: `${options.managers.commands.prefix}help | mTxServ.com`},
			{ type: ActivityType.Playing , name: 'Server by mTxServ.com' },
		])

		this.provider = new FirebaseProvider();

		this.mainGuilds = options.mainGuilds || [];

		this.language = options.language || "en";
		this.logChannel = options.logChannel || "";
	}

	isMainGuild(guildId) {
		return this.mainGuilds.indexOf(guildId) !== -1
	}
}

exports.mTxServClient = mTxServClient;