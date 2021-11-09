const cron = require("node-cron");

const loaAlarm = (client, message, channelID, roleID) => {
  // console.log("알람 실행");

  //? 알람 전달 할 채널과 역할 ID 찾는 파트.
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

  //? 알람 메시지들 정리.

  const message_MON = `${alarmRoleID}\n\`\`\`diff\n월요일 로스트아크 일정\n\n- 카오스 게이트 & 모험섬 출현 10분 전입니다.\n\n+ 카오스 게이트는 매 정시마다, 모험섬은 11:00, 13:00, 19:00, 21:00, 23:00 에 열립니다.\`\`\``;
  const message_TUE = `${alarmRoleID}\n\`\`\`diff\n화요일 로스트아크 일정\n\n- 필드 보스 & 유령선 & 모험섬 출현 10분 전입니다.\n\n+ 필드 보스와 유령선은 매 정시마다,\n+ 모험섬은 11:00, 13:00, 19:00, 21:00, 23:00 에 열립니다.\`\`\``;
  const message_WED = `${alarmRoleID}\n\`\`\`diff\n수요일 로스트아크 일정\n\n- 모험섬 출현 10분 전입니다.\n\n+ 모험섬은 11:00, 13:00, 19:00, 21:00, 23:00 에 열립니다.\`\`\``;
  const message_THU = `${alarmRoleID}\n\`\`\`diff\n목요일 로스트아크 일정\n\n- 카오스 게이트 & 유령선 & 모험섬 출현 10분 전입니다.\n\n+ 카오스 게이트와 유령선은 매 정시마다,\n+ 모험섬은 11:00, 13:00, 19:00, 21:00, 23:00 에 열립니다.\`\`\``;
  const message_FRI = `${alarmRoleID}\n\`\`\`diff\n금요일 로스트아크 일정\n\n- 필드 보스 & 모험섬 출현 10분 전입니다.\n\n+ 필드 보스는 매 정시마다, 모험섬은 11:00, 13:00, 19:00, 21:00, 23:00 에 열립니다.\`\`\``;
  const message_SAT = `${alarmRoleID}\n\`\`\`diff\n토요일 로스트아크 일정\n\n- 카오스 게이트 & 유령선 & 모험섬 출현 10분 전입니다.\n\n+ 카오스 게이트와 유령선은 매 정시마다,\n+ 모험섬은 9:00, 11:00, 13:00, 19:00, 21:00, 23:00 에 열립니다.\n\n+ 주말 모험섬은 1부 9:00, 11:00, 13:00 \n+ 2부 19:00, 21:00, 23:00 로 나뉘며, 각각 보상 획득이 가능합니다.\`\`\``;
  const message_SUN = `${alarmRoleID}\n\`\`\`diff\n일요일 로스트아크 일정\n\n- 카오스 게이트 & 필드 보스 & 모험섬 출현 10분 전입니다.\n\n+ 카오스 게이트와 필드 보스는 매 정시마다,\n+ 모험섬은 9:00, 11:00, 13:00, 19:00, 21:00, 23:00 에 열립니다.\n\n+ 주말 모험섬은 1부 9:00, 11:00, 13:00 \n+ 2부 19:00, 21:00, 23:00 로 나뉘며, 각각 보상 획득이 가능합니다.\`\`\``;

  //? 각 시간별 cron 표현식 정리.
  // [월, 화, 목, 금] 은 시간대가 같으니까 묶자.
  // 수요일..은 조금 어려울 것 같고, 주말에 다음날 8시 50분에도 알림이 가는데 해결해야할 듯.

  const rule_MTTF = (day) => {
    // MON TUE THU FRI 월화목금 11시 ~ 24시 -> 17 ~ 06
    // 당일 17시 ~ 23시 / 다음날 00 ~ 06시?
    return `50 10-23 * * ${day}`;
  };

  const rule_MON = `50 17-23 * * SUN`;
  const rule_MON_nextDay = `50 0-6 * * MON`;

  const rule_TUE = `50 17-23 * * MON`;
  const rule_TUE_nextDay = `50 0-6 * * TUE`;

  const rule_WED_09 = `50 8 * * WED`;
  const rule_WED_11 = `50 10 * * WED`;
  const rule_WED_19 = `50 18 * * WED`;
  const rule_WED_21 = `50 20 * * WED`;
  const rule_WED_23 = `50 22 * * WED`;

  const rule_THU = `50 17-23 * * WED`;
  const rule_THU_nextDay = `50 0-6 * * THU`;

  const rule_FRI = `50 17-23 * * THU`;
  const rule_FRI_nextDay = `50 0-6 * * FRI`;

  const rule_SAT_09 = `50 8 * * FRI`;
  const rule_SAT_after11 = `50 10-23 * * SAT`;
  const rule_SUN_09 = `50 8 * * SAT`;
  const rule_SUN_after11 = `50 10-23 * * SUN`;

  const test = `* 10 * * MON`;

  let now = new Date();
  console.log(now);
  console.log(now.getHours());

  cron.schedule(test, () => {
    client.channels.cache.get(`${alarmChannelID}`).send(message_TUE);
  });
};

module.exports = { loaAlarm };
