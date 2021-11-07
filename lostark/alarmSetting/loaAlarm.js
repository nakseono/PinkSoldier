const cron = require("node-cron");

const loaAlarm = (client, channelID, roleID) => {
  const monMessage = `<@&${roleID}>\n\`\`\`diff\n월요일 로스트아크 일정\n\n- 카오스 게이트 & 모험섬 출현 10분 전입니다.\n\n+ 카오스 게이트는 매 정시마다, 모험섬은 11:00, 13:00, 19:00, 21:00, 23:00 에 열립니다.\`\`\``;

  cron.schedule("* * * * * *", () => {
    client.channels.cache.get(channelID).send(monMessage);
    console.log("알람 메시지 보내는중");
  });
};

module.exports = { loaAlarm };
