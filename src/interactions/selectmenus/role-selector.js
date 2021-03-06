const { SelectMenu } = require("sheweny");
const mTxServUtil = require("../../util/mTxServUtil");
	
module.exports = class RoleSelectMenu extends SelectMenu {
	constructor(client) {
		super(client, ["game-selector", "lang-selector"]);
	}
	
	async execute(interaction) {
		// eslint-disable-next-line
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

		const response = mTxServUtil.saySuccess(mTxServUtil.translate(interaction, ["role-selector", "success"]));
		await interaction.reply({
			embeds: [response],
			ephemeral: true
		})
	}
};
