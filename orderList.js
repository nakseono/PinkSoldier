const { MessageEmbed } = require("discord.js");

const returnOrderList = (message) => {
  const embedMessage = new MessageEmbed()
    .setColor("#ff3399")
    .setTitle(`믹스테잎 명령어 리스트`)
    .addFields(
      {
        name: `\`!정보 [닉네임]\``,
        value: `로스트아크 전투정보실에서 [닉네임]의 데이터를 가져옵니다.`,
      },
      {
        name: `\`!로아와 [닉네임]\``,
        value: `입력된 [닉네임]에 해당하는 로아와 링크를 출력합니다.`,
      },
      {
        name: `\`!정산 [닉네임]\``,
        value: `입력된 [닉네임]이 보유한 캐릭터 목록과 주간 수입을 출력합니다.`,
      },
      {
        name: `\`!이벤트\``,
        value: `현재 진행중인 이벤트 리스트를 불러옵니다.`,
      },
      {
        name: `\`!분배 [가격]\``,
        value: `입력된 [가격]에 대하여 얼마를 입찰하면\n공대원들과 나눴을 때 1/N이 되는지 계산합니다.`,
      },
      {
        name: `\`!경매 [가격]\``,
        value: `입력된 [가격]에 대하여 최대 얼마까지 입찰해야 이득인지 계산합니다.`,
      },
      {
        name: `\`!청소\``,
        value: `명령어가 입력된 채팅 채널의 채팅 내역을 30개 지웁니다.\n지우기 전 확인을 위한 경고창이 표시됩니다.`,
      }
      // {
      //   name: `\`!알람세팅\``,
      //   value: `현재 서버에 \`데일리-로아-알림\` 채널이 생성되고,\n매 정각 55/58분마다 알림이 가게 설정됩니다.`,
      // },
      // {
      //   name: `\`!알람역할\``,
      //   value: `\`데일리-로아-알림\` 채널에서 \`@역할\` 명령어를 통해\n알림을 받을지 말지 설정하는 창이 출력됩니다.`,
      // },
      // {
      //   name: `\`!알람실행\``,
      //   value: `봇 업데이트 이후 알람을 다시 받아오도록 설정합니다.`,
      // }
    );

  message.channel.send({ embeds: [embedMessage] });
};

module.exports = { returnOrderList };
