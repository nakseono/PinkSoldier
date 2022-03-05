const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('핑')
		.setDescription('퐁! 이라고 대답합니다.'),
	async execute(interaction) {
		await interaction.reply('퐁!');
	},
};