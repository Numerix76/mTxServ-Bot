const { ShewenyClient } = require("sheweny");
const FirebaseProvider = require('./provider/FirebaseProvider');
const FeedMonitor = require("./services/FeedMonitor");
const Ranker = require("./services/Ranker");

class mTxServClient extends ShewenyClient {
	constructor(options, clientOptions)
	{
		super(options, clientOptions);

		this.feedMonitor = new FeedMonitor(options.feeds);
		// this.statusMonitor = new StatusMonitor(options.statusURL);
		this.ranker = new Ranker();

		// this.statusUpdater = new StatusUpdater(this, [
		// 	{ type: 'WATCHING', name: `${process.env.BOT_COMMAND_PREFIX}giveaway | Win prizes!`},
		// 	{ type: 'PLAYING', name: `${process.env.BOT_COMMAND_PREFIX}help | mTxServ.com`},
		// 	{ type: 'PLAYING', name: 'Server by mTxServ.com' },
		// ])

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