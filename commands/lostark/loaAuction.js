const fs = require("fs");
const { MessageEmbed } = require("discord.js");
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('경매')
		.setDescription('입력된 [가격]에 대하여 최대 얼마까지 입찰해야 이득인지 계산합니다.')
    .addStringOption(option =>
      option.setName('가격') //! 옵션 이름에는 공백이 들어가면 안된다. 에러 발생함.
        .setDescription('계산할 경매 금액을 입력합니다.')
        .setRequired(true)),
	async execute(interaction) {
    let now = new Date();
    let amount = (JSON.stringify(interaction.options._hoistedOptions[0]["value"])).replace(/\"/gi, "");
    
    const people4 = Math.floor(amount * 0.6478);
    const people8 = Math.floor(amount * 0.7556);

    const embedMessage = new MessageEmbed()
    .setColor("#ff3399")
    .setTitle(`경매 최대 입찰금 계산 - ${amount}골드`)
    .addFields(
      {
        name: `4인 기준`,
        value: `\`${people4}\` 골드까지만 입찰하세용`,
        // inline: true,
      },
      {
        name: "8인 기준",
        value: `\`${people8}\` 골드까지만 입찰하세용`,
        // inline: true,
      }
    );

    const errorEmbedMessage = new MessageEmbed()
      .setColor("#ff3399")
      .setTitle(`에러가 발생했습니다!`)
      .setDescription(
        `아마도 숫자가 아닌 문자를 입력하신 것 같아요!\n그게 아니라면 올바른 명령을 요청했는지 \`/명령어\` 를 통해 다시 한번 용례를 확인해주시고,\n에러가 지속된다면 개발자에게 문의해주세요.`
      );

    try {
      fs.appendFile(
        "logs/useLog.txt",
        `${now} || /경매 ${amount}\n`,
        (err) => {
          // console.log(`경매 에러 : ${err}`);
        }
      );

      isNaN(amount) ? await interaction.reply({ embeds: [errorEmbedMessage] }) : await interaction.reply({ embeds: [embedMessage] });

    } catch(error) {
      console.error(`error: ${error}`)

      fs.appendFile(
        "logs/bugLog.txt",
        `${now} || /경매 ${amount} / ${error}\n`,
        (err) => {
          // console.log(`경매 에러 : ${err}`);
        }
      );
    }

	},
};