const { MessageEmbed } = require("discord.js");

const returnOrderList = (message) => {
  const embedMessage = new MessageEmbed()
    .setColor("#ff3399")
    .setTitle(`핑크솔져 명령어 리스트`)
    .addFields(
      {
        name: `\`!정보 [닉네임]\``,
        value: `로스트아크 전투정보실에서 [닉네임]의 데이터를 가져옵니다.\n예시 : \`!정보 김낙서\``,
        // inline: true,
      },
      {
        name: `\`!로아와 [닉네임]\``,
        value: `입력된 [닉네임]에 해당하는 로아와 링크를 출력합니다. \n예시 : \`!로아와 김낙서\``,
        // inline: true,
      },
      {
        name: `\`!이벤트\``,
        value: `현재 진행중인 이벤트 리스트를 불러옵니다.`,
      },
      {
        name: `\`!분배 [가격]\``,
        value: `입력된 [가격]에 대하여 얼마를 입찰하면\n공대원들과 나눴을 때 1/N이 되는지 계산합니다.\n예시 : \`!분배 24000\``,
      },
      {
        name: `\`!경매 [가격]\``,
        value: `입력된 [가격]에 대하여 최대 얼마까지 입찰해야 이득인지 계산합니다.\n예시 : \`!경매 24000\``,
      },
      {
        name: `\`!청소\``,
        value: `명령어가 입력된 채팅 채널의 채팅 내역을 30개 지웁니다.\n지우기 전 확인을 위한 경고창이 표시됩니다.`,
      }
    );

  message.channel.send({ embeds: [embedMessage] });
};

module.exports = { returnOrderList };
