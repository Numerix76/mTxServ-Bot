const { Event } = require("sheweny");

module.exports = class unhandledRejectionEvent extends Event {
	constructor(client) {
		super(client, 'unhandledRejection', {
			emitter: process,
		});
	}
	execute(ctx) {
		console.log('Woops... An unhandledRejection error occured :');
		console.log(ctx);
	}
};
