const { ShewenyClient } = require("sheweny");
const FirebaseProvider = require('./provider/FirebaseProvider');

class mTxServClient extends ShewenyClient {
	constructor(options, clientOptions)
	{
		super(options, clientOptions);

		// this.feeds = new FeedMonitor(options.feeds);
		// this.statusMonitor = new StatusMonitor(options.statusURL);
		// this.ranker = new Ranker();

		// this.statusUpdater = new StatusUpdater(this, [
		// 	{ type: 'WATCHING', name: `${process.env.BOT_COMMAND_PREFIX}giveaway | Win prizes!`},
		// 	{ type: 'PLAYING', name: `${process.env.BOT_COMMAND_PREFIX}help | mTxServ.com`},
		// 	{ type: 'PLAYING', name: 'Server by mTxServ.com' },
		// ])

		this.provider = new FirebaseProvider();

		console.log("J'arrive ici");
	}
}

exports.mTxServClient = mTxServClient;