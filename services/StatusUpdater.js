module.exports = class StatusUpdater {
	constructor(client, status)
	{
		this.client = client
		this.status = status
		this.curStatus = 0
	}
	
	updateStatus()
	{
		this.client.user?.setPresence({
			status: 'online',
			activities: [
				{
					name: this.status[ this.curStatus ].name,
					type: this.status[ this.curStatus ].type
				}
			]
		})

		if ( ++this.curStatus >= this.status.length )
		{
			this.curStatus = 0
		}
	}
}