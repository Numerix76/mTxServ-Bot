const { SelectMenu } = require("sheweny");
const mTxServUtil = require("../../util/mTxServUtil");
	
module.exports = class SelectTest extends SelectMenu {
	constructor(client) {
		super(client, ["game-selector", "lang-selector"]);
	}
	
	async execute(interaction) {
		const { customId, values, member } = interaction

		const component = interaction.component
		const removed = component.options.filter((option) => {
			return !values.includes(option.value)
		})

		for (const id of removed) {
			member.roles.remove(id.value)
		}

		for (const id of values) {
			member.roles.add(id)
		}

		const response = mTxServUtil.saySuccess(interaction, mTxServUtil.translate(interaction, ["role-selector", "success"]));
		await interaction.reply({
			embeds: [response],
			ephemeral: true
		})
	}
};
