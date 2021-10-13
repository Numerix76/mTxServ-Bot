const FeedMonitor = require('../services/FeedMonitor')
const InviteManager = require('../services/InviteManager')
const StatusUpdater = require('../services/StatusUpdater')
const Ranker = require('../services/Ranker')
const FirebaseProvider = require('../provider/FirebaseProvider')

const Discord = require('discord.js')

module.exports = class mTxServClient extends Discord.Client {
	constructor(options) {
		super(options);

		this.feedMonitor = new FeedMonitor(options.feeds);
		this.inviteManager = new InviteManager();
		this.ranker = new Ranker()

		this.statusUpdater = new StatusUpdater(this, [
		    { type: 'WATCHING', name: `${process.env.BOT_COMMAND_PREFIX}giveaway | Win prizes!`},
		    { type: 'PLAYING', name: `${process.env.BOT_COMMAND_PREFIX}help | mTxServ.com`},
		    { type: 'PLAYING', name: 'Server by mTxServ.com' },
		])

		this.mainGuilds = options.mainGuilds

		this.provider = new FirebaseProvider()
	}

	isMainGuild(guildId) {
		return this.mainGuilds.indexOf(guildId) !== -1
	}
};