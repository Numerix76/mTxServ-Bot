const { Event } = require("sheweny");

module.exports = class rejectionHandledEvent extends Event {
	constructor(client) {
		super(client, 'rejectionHandled', {
			emitter: process,
		});
	}
	execute(ctx) {
		console.log('Woops... An rejectionHandled error occured :');
		console.log(ctx);
	}
};
