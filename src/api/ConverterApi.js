const { EmbedBuilder, Colors } = require("discord.js");
const WebSocket = require("ws");
const mTxServUtil = require("../util/mTxServUtil");

class ConverterApi {
	constructor(url, format, interaction)
	{
		this.url = url
		this.format = format
		this.interaction = interaction

		this.embed = new EmbedBuilder()
			.setTitle(mTxServUtil.translate(this.interaction, ["convert", "conversion_of"], { "url": url }))
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
				case "download_started": this.download_started(); break;
				case "download_progress": this.download_progress(data); break;
				case "download_finished": this.download_finished(); break;
				case "conversion_started": this.conversion_started(); break;
				case "conversion_progress": this.conversion_progress(data); break;
				case "conversion_finished": this.conversion_finished(); break;
				case "finished": this.finished(data); break;
				case "error": this.error(data); break;
			}
		});

		this.socket.on('error', () => {
			isError = true;
			this.error({ message: mTxServUtil.translate(this.interaction, ["convert", "cant_connect"]) });
		})

		this.socket.on('close', (code) => {
			if ( code !== 1005 && !isError )
				this.error({ message: mTxServUtil.translate(this.interaction, ["convert", "lost_connection"]) });

			isError = false;
		})
	}

	infos_music(data)
	{
		if ( data.live )
		{
			this.error({ message: mTxServUtil.translate(this.interaction, ["convert", "no_live"]) });
			return;
		}

		this.embed.addFields([
			{
				name: mTxServUtil.translate(this.interaction, ["convert", "title"]),
				value: data.title, 
				inline: true
			},
			{
				name: mTxServUtil.translate(this.interaction, ["convert", "created_by"]),
				value: data.artist, 
				inline: true
			},
			{
				name: mTxServUtil.translate(this.interaction, ["convert", "duration"]),
				value: this.toHHMMSS(data.duration), 
				inline: true
			}
		])
		this.embed.setColor(Colors.Blue)
		this.embed.setTimestamp()

		if (data.thumbnail)
			this.embed.setImage(data.thumbnail)

		this.interaction.editReply({
			embeds: [this.embed]
		});
	}

	download_started()
	{
		const embed = EmbedBuilder.from(this.embed)
		embed.addFields({ name: mTxServUtil.translate(this.interaction, ["convert", "download"]), value: `0%`, inline: true })

		this.interaction.editReply({
			embeds: [embed]
		});
	}

	download_progress(data)
	{
		const embed = EmbedBuilder.from(this.embed)
		embed.addFields({ name: mTxServUtil.translate(this.interaction, ["convert", "download"]), value: `${data.percent}%`, inline: true })

		this.interaction.editReply({
			embeds: [embed]
		});
	}

	download_finished()
	{
		this.embed.addFields({ name: mTxServUtil.translate(this.interaction, ["convert", "download"]), value: `100%`, inline: true })

		this.interaction.editReply({
			embeds: [this.embed]
		});
	}

	conversion_started()
	{
		const embed = EmbedBuilder.from(this.embed)
		embed.addFields({ name: mTxServUtil.translate(this.interaction, ["convert", "conversion"]), value:`0%`, inline:true })

		this.interaction.editReply({
			embeds: [embed]
		});
	}

	conversion_progress(data)
	{
		const embed = EmbedBuilder.from(this.embed)
		embed.addFields({ name: mTxServUtil.translate(this.interaction, ["convert", "conversion"]), value:`${data.percent}%`, inline:true })

		this.interaction.editReply({
			embeds: [embed]
		});
	}

	conversion_finished()
	{
		this.embed.addFields({ name: mTxServUtil.translate(this.interaction, ["convert", "conversion"]), value:`100%`, inline:true })

		this.interaction.editReply({
			embeds: [this.embed]
		});
	}

	finished(data)
	{
		this.embed.addFields({ name: mTxServUtil.translate(this.interaction, ["convert", "download_link"]), value: data.url })

		this.interaction.editReply({
			embeds: [this.embed]
		});

		this.socket.close();
	}

	error(data)
	{
		const embed = this.embed;
		embed.addFields({ name: mTxServUtil.translate(this.interaction, ["convert", "error"]), value: data.message })

		if ( data.log )
			embed.addFields({ name: mTxServUtil.translate(this.interaction, ["convert", "logs"]), value: data.log })

		this.interaction.editReply({
			embeds: [this.embed]
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