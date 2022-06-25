const { Event } = require("sheweny");

module.exports = class warningEvent extends Event {
	constructor(client) {
		super(client, 'warning', {
			emitter: process,
		});
	}
	execute(ctx) {
		console.log('Woops... An warning error occured :');
		console.log(ctx);
	}
};
