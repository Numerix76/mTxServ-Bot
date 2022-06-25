const { Event } = require("sheweny");

module.exports = class uncaughtExceptionEvent extends Event {
	constructor(client) {
		super(client, 'uncaughtException', {
			emitter: process,
		});
	}
	execute(ctx) {
		console.log('Woops... An uncaughtException error occured :');
		console.log(ctx);
	}
};
