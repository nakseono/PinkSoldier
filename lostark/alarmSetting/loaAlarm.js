const cron = require("node-cron");

const loaAlarm = (client, message, channelID, roleID) => {
  // console.log("알람 실행");

  let alarmChannelID;
  let alarmRoleID;

  if (channelID) {
    alarmChannelID = channelID;
  } else {
    alarmChannelID = String(
      client.channels.cache.find((x) => x.name === "로스트아크-알람")
    ).slice(2, -1);
  }

  if (roleID) {
    alarmRoleID = roleID;
  } else {
    alarmRoleID = message.guild.roles.cache.find(
      (role) => role.name === "loaAlarm"
    );
  }

  // console.log(`alarmChannelID : ${alarmChannelID}`);
  // console.log(`alarmRoleID : ${alarmRoleID}`);

  const monMessage = `${alarmRoleID}\n\`\`\`diff\n월요일 로스트아크 일정\n\n- 카오스 게이트 & 모험섬 출현 10분 전입니다.\n\n+ 카오스 게이트는 매 정시마다, 모험섬은 11:00, 13:00, 19:00, 21:00, 23:00 에 열립니다.\`\`\``;

  cron.schedule("* * * * * *", () => {
    client.channels.cache.get(`${alarmChannelID}`).send(monMessage);
  });
};

module.exports = { loaAlarm };
