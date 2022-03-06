const WebSocket = require("ws");
const Discord = require("discord.js");
const mTxServUtil = require("../util/mTxServUtil");

class ConverterApi {
	constructor(url, format, lang, message, interaction)
	{
		this.url = url
		this.format = format
		this.lang = lang
		this.message = message
		this.interaction = interaction

		this.embed = new Discord.MessageEmbed()
			.setTitle(this.lang["convert"]["conversion_of"].replace("%url%", this.url))
	}

	async convert()
	{
		let isError = false;
		this.socket = new WebSocket('ws://92.222.234.121:3000/get/' + this.format);

		this.socket.on('open', () => {
			this.socket.send(this.url);
		});

		this.socket.on('message', (msg) => {
			const data = JSON.parse(msg);

			switch(data.type)
			{
				case "infos_music": this.infos_music(data); break;
				case "download_started": this.download_started(data); break;
				case "download_progress": this.download_progress(data); break;
				case "download_finished": this.download_finished(data); break;
				case "conversion_started": this.conversion_started(data); break;
				case "conversion_progress": this.conversion_progress(data); break;
				case "conversion_finished": this.conversion_finished(data); break;
				case "finished": this.finished(data); break;
				case "error": this.error(data); break;
			}
		});

		this.socket.on('error', () => {
			isError = true;
			this.error({message: this.lang["convert"]["cant_connect"]});
		})

		this.socket.on('close', (code) => {
			if ( code !== 1005 && !isError )
				this.error({message: this.lang["convert"]["lost_connection"]});

			isError = false;
		})
	}

	infos_music(data)
	{
		if ( data.live )
		{
			this.error({message: this.lang["convert"]["no_live"]});
			return;
		}

		this.embed.addField(this.lang["convert"]["title"], `${data.title}`, true)
		this.embed.addField(this.lang["convert"]["created_by"], `${data.artist}`, true)
		this.embed.addField(this.lang["convert"]["duration"], `${this.toHHMMSS(data.duration)}`, true)
		this.embed.setColor('BLUE')
		this.embed.setTimestamp()

		if (data.thumbnail)
			this.embed.setImage(data.thumbnail)

		mTxServUtil.editResponse(this.message, this.interaction, {
			embeds: [this.embed]
		});
	}

	download_started(data)
	{
		const embed = this.embed;
		embed.fields[4] = {name:this.lang["convert"]["download"], value:`0%`, inline:true}

		mTxServUtil.editResponse(this.message, this.interaction, {
			embeds: [embed]
		});
	}

	download_progress(data)
	{
		const embed = this.embed;
		embed.fields[4] = {name:this.lang["convert"]["download"], value:`${data.percent}%`, inline:true}

		mTxServUtil.editResponse(this.message, this.interaction, {
			embeds: [embed]
		});
	}

	download_finished(data)
	{
		const embed = this.embed;
		embed.fields[4] = {name:this.lang["convert"]["download"], value:`100%`, inline:true}

		mTxServUtil.editResponse(this.message, this.interaction, {
			embeds: [embed]
		});
	}

	conversion_started(data)
	{
		const embed = this.embed;
		embed.fields[5] = {name:this.lang["convert"]["conversion"], value:`0%`, inline:true}

		mTxServUtil.editResponse(this.message, this.interaction, {
			embeds: [embed]
		});
	}

	conversion_progress(data)
	{
		const embed = this.embed;
		embed.fields[5] = {name:this.lang["convert"]["conversion"], value:`${data.percent}%`, inline:true}

		mTxServUtil.editResponse(this.message, this.interaction, {
			embeds: [embed]
		});
	}

	conversion_finished(data)
	{
		const embed = this.embed;
		embed.fields[5] = {name:this.lang["convert"]["conversion"], value:`100%`, inline:true}

		mTxServUtil.editResponse(this.message, this.interaction, {
			embeds: [embed]
		});
	}

	finished(data)
	{
		const embed = this.embed;
		embed.addField(this.lang["convert"]["download_link"], `${data.url}`)

		mTxServUtil.editResponse(this.message, this.interaction, {
			embeds: [embed]
		});

		this.socket.close();
	}

	error(data)
	{
		const embed = this.embed;
		embed.addField(this.lang["convert"]["error"], `${data.message}`)

		if ( data.log )
			embed.addField(this.lang["convert"]["logs"], `${data.log}`)

		mTxServUtil.editResponse(this.message, this.interaction, {
			embeds: [embed]
		});

		this.socket.close()
	}

	toHHMMSS (secs)
	{
		var sec_num = parseInt(secs, 10)
		var hours   = Math.floor(sec_num / 3600)
		var minutes = Math.floor(sec_num / 60) % 60
		var seconds = sec_num % 60

		return [hours,minutes,seconds]
			.map(v => v < 10 ? "0" + v : v)
			.filter((v,i) => v !== "00" || i > 0)
			.join(":")
	}
}

module.exports = ConverterApi;