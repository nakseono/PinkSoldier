const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('핑')
		.setDescription('퐁! 이라고 대답합니다.')
    .addStringOption(option =>
      option.setName('테스트옵션') //! 옵션 이름에는 공백이 들어가면 안된다. 에러 발생함.
        .setDescription('테스트를 위해 넣은 option 입니다.')
        .setRequired(true)),
	async execute(interaction) {
		// console.log();
		await interaction.reply('퐁!');
	},
};