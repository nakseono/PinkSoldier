const { MessageEmbed } = require("discord.js");
const botImage = require("./pinkSoldier.png");

const returnOrderList = () => {
  const embedMessage = new MessageEmbed()
    .setColor("#ff3399")
    .setTitle(`핑크솔져 명령어 리스트`)
    .setThumbnail(`${botImage}`)
    .addFields(
      {
        name: "!정보 [닉네임]",
        value: `로스트아크 전투정보실에서 [닉네임]의 데이터를 가져옵니다.\n예시 : \`!정보 김낙서\``,
      },
      {
        name: "!로아와 [닉네임]",
        value: `입력된 [닉네임]에 해당하는 로아와 링크를 출력합니다. \n예시 : \`!로아와 김낙서\``,
      },
      {
        name: "!분배 [가격]",
        value: `입력된 [가격]에 대하여 4인 레이드, 8인 레이드 기준으로 얼마를 입찰하면 n빵이 되는지 계산합니다.\n예시 : \`!분배 24000\``,
      }
    );

  return embedMessage;
};

module.exports = { returnOrderList };
