const { MessageEmbed } = require("discord.js");

const returnOrderList = () => {
  const embedMessage = new MessageEmbed()
    .setColor("#ff3399")
    .setTitle(`핑크솔져 명령어 리스트`)
    .addFields(
      {
        name: "!정보 [닉네임]",
        value: `로스트아크 전투정보실에서\n[닉네임]의 데이터를 가져옵니다.\n예시 : \`!정보 김낙서\``,
        inline: true,
      },
      {
        name: "!로아와 [닉네임]",
        value: `입력된 [닉네임]에 해당하는\n로아와 링크를 출력합니다. \n예시 : \`!로아와 김낙서\``,
        inline: true,
      }
    )
    .addFields(
      {
        name: "!분배 [가격]",
        value: `입력된 [가격]에 대하여 얼마를 입찰하면 n빵이 되는지 계산합니다.\n예시 : \`!분배 24000\``,
      },
      {
        name: "!경매 [가격]",
        value: `입력된 [가격]에 대하여 최대 얼마까지 입찰해야 이득인지 계산합니다.\n예시 : \`!경매 24000\``,
      }
    );

  return embedMessage;
};

module.exports = { returnOrderList };
