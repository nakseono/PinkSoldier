const cron = require("node-cron");
const fs = require("fs");

const loaAlarm = (client) => {
  const rule_MTTF_55 = (day) => {
    // MON TUE THU FRI SAT SUN 월화목금토일 11시 ~ 24시 -> 1~14
    return `55 1-14 * * ${day}`;
  };

  const rule_MTTF_58 = (day) => {
    // MON TUE THU FRI SAT SUN 월화목금토일 11시 ~ 24시 -> 2~15
    return `58 1-14 * * ${day}`;
  };

  const rule_WED_11_55 = `55 1 * * WED`;
  const rule_WED_11_58 = `58 1 * * WED`;

  const rule_WED_13_55 = `55 3 * * WED`;
  const rule_WED_13_58 = `58 3 * * WED`;

  const rule_WED_19_55 = `55 9 * * WED`;
  const rule_WED_19_58 = `58 9 * * WED`;

  const rule_WED_21_55 = `55 11 * * WED`;
  const rule_WED_21_58 = `58 11 * * WED`;

  const rule_WED_23_55 = `55 13 * * WED`;
  const rule_WED_23_58 = `58 13 * * WED`;

  const rule_Weekend_55 = (day) => {
    return `55 22 * * ${day}`;
  };
  const rule_Weekend_58 = (day) => {
    return `58 22 * * ${day}`;
  };

  let alarmChannelID = [];
  let alarmRoleID = [];

  //? 알람 메시지들 정리.

  const message_MON_55 = (alarmRoleID) => {
    return `${alarmRoleID}\n\`\`\`diff\n월요일 로스트아크 일정\n\n- 카오스 게이트 & 모험섬 출현 5분 전입니다.\n\n+ 카오스 게이트는 매 정시마다, 모험섬은 11:00, 13:00, 19:00, 21:00, 23:00 에 열립니다.\`\`\``;
  };
  const message_MON_58 = (alarmRoleID) => {
    return `${alarmRoleID}\n\`\`\`diff\n월요일 로스트아크 일정\n\n- 카오스 게이트 & 모험섬 출현 2분 전입니다.\n\n+ 카오스 게이트는 매 정시마다, 모험섬은 11:00, 13:00, 19:00, 21:00, 23:00 에 열립니다.\`\`\``;
  };
  const message_TUE_55 = (alarmRoleID) => {
    return `${alarmRoleID}\n\`\`\`diff\n화요일 로스트아크 일정\n\n- 필드 보스 & 유령선 & 모험섬 출현 5분 전입니다.\n\n+ 필드 보스와 유령선은 매 정시마다,\n+ 모험섬은 11:00, 13:00, 19:00, 21:00, 23:00 에 열립니다.\`\`\``;
  };
  const message_TUE_58 = (alarmRoleID) => {
    return `${alarmRoleID}\n\`\`\`diff\n화요일 로스트아크 일정\n\n- 필드 보스 & 유령선 & 모험섬 출현 2분 전입니다.\n\n+ 필드 보스와 유령선은 매 정시마다,\n+ 모험섬은 11:00, 13:00, 19:00, 21:00, 23:00 에 열립니다.\`\`\``;
  };
  const message_WED_55 = (alarmRoleID) => {
    return `${alarmRoleID}\n\`\`\`diff\n수요일 로스트아크 일정\n\n- 모험섬 출현 5분 전입니다.\n\n+ 모험섬은 11:00, 13:00, 19:00, 21:00, 23:00 에 열립니다.\`\`\``;
  };
  const message_WED_58 = (alarmRoleID) => {
    return `${alarmRoleID}\n\`\`\`diff\n수요일 로스트아크 일정\n\n- 모험섬 출현 2분 전입니다.\n\n+ 모험섬은 11:00, 13:00, 19:00, 21:00, 23:00 에 열립니다.\`\`\``;
  };
  const message_THU_55 = (alarmRoleID) => {
    return `${alarmRoleID}\n\`\`\`diff\n목요일 로스트아크 일정\n\n- 카오스 게이트 & 유령선 & 모험섬 출현 5분 전입니다.\n\n+ 카오스 게이트와 유령선은 매 정시마다,\n+ 모험섬은 11:00, 13:00, 19:00, 21:00, 23:00 에 열립니다.\`\`\``;
  };
  const message_THU_58 = (alarmRoleID) => {
    return `${alarmRoleID}\n\`\`\`diff\n목요일 로스트아크 일정\n\n- 카오스 게이트 & 유령선 & 모험섬 출현 2분 전입니다.\n\n+ 카오스 게이트와 유령선은 매 정시마다,\n+ 모험섬은 11:00, 13:00, 19:00, 21:00, 23:00 에 열립니다.\`\`\``;
  };
  const message_FRI_55 = (alarmRoleID) => {
    return `${alarmRoleID}\n\`\`\`diff\n금요일 로스트아크 일정\n\n- 필드 보스 & 모험섬 출현 5분 전입니다.\n\n+ 필드 보스는 매 정시마다, 모험섬은 11:00, 13:00, 19:00, 21:00, 23:00 에 열립니다.\`\`\``;
  };
  const message_FRI_58 = (alarmRoleID) => {
    return `${alarmRoleID}\n\`\`\`diff\n금요일 로스트아크 일정\n\n- 필드 보스 & 모험섬 출현 2분 전입니다.\n\n+ 필드 보스는 매 정시마다, 모험섬은 11:00, 13:00, 19:00, 21:00, 23:00 에 열립니다.\`\`\``;
  };
  const message_SAT_55 = (alarmRoleID) => {
    return `${alarmRoleID}\n\`\`\`diff\n토요일 로스트아크 일정\n\n- 카오스 게이트 & 유령선 & 모험섬 출현 5분 전입니다.\n\n+ 카오스 게이트와 유령선은 매 정시마다,\n+ 모험섬은 9:00, 11:00, 13:00, 19:00, 21:00, 23:00 에 열립니다.\n\n+ 주말 모험섬은 1부 9:00, 11:00, 13:00 \n+ 2부 19:00, 21:00, 23:00 로 나뉘며, 각각 보상 획득이 가능합니다.\`\`\``;
  };
  const message_SAT_58 = (alarmRoleID) => {
    return `${alarmRoleID}\n\`\`\`diff\n토요일 로스트아크 일정\n\n- 카오스 게이트 & 유령선 & 모험섬 출현 2분 전입니다.\n\n+ 카오스 게이트와 유령선은 매 정시마다,\n+ 모험섬은 9:00, 11:00, 13:00, 19:00, 21:00, 23:00 에 열립니다.\n\n+ 주말 모험섬은 1부 9:00, 11:00, 13:00 \n+ 2부 19:00, 21:00, 23:00 로 나뉘며, 각각 보상 획득이 가능합니다.\`\`\``;
  };
  const message_SUN_55 = (alarmRoleID) => {
    return `${alarmRoleID}\n\`\`\`diff\n일요일 로스트아크 일정\n\n- 카오스 게이트 & 필드 보스 & 모험섬 출현 5분 전입니다.\n\n+ 카오스 게이트와 필드 보스는 매 정시마다,\n+ 모험섬은 9:00, 11:00, 13:00, 19:00, 21:00, 23:00 에 열립니다.\n\n+ 주말 모험섬은 1부 9:00, 11:00, 13:00 \n+ 2부 19:00, 21:00, 23:00 로 나뉘며, 각각 보상 획득이 가능합니다.\`\`\``;
  };
  const message_SUN_58 = (alarmRoleID) => {
    return `${alarmRoleID}\n\`\`\`diff\n일요일 로스트아크 일정\n\n- 카오스 게이트 & 필드 보스 & 모험섬 출현 2분 전입니다.\n\n+ 카오스 게이트와 필드 보스는 매 정시마다,\n+ 모험섬은 9:00, 11:00, 13:00, 19:00, 21:00, 23:00 에 열립니다.\n\n+ 주말 모험섬은 1부 9:00, 11:00, 13:00 \n+ 2부 19:00, 21:00, 23:00 로 나뉘며, 각각 보상 획득이 가능합니다.\`\`\``;
  };

  // cron.schedule("* * * * *", () => {
  //   let data = JSON.parse(fs.readFileSync("alarmData.json"));

  //   for (let i = 0; i < data.length; i++) {
  //     alarmChannelID[i] = data[i]["channel"];
  //     alarmRoleID[i] = `<@&${data[i]["role"]}>`;
  //   }

  //   for (let k = 0; k < alarmChannelID.length; k++) {
  //     client.channels.cache
  //       .get(`${alarmChannelID[k]}`)
  //       .send(message_MON_55(alarmRoleID[k]));
  //   }
  // });

  //! 월
  cron.schedule(rule_MTTF_55(`MON`), () => {
    let data = JSON.parse(fs.readFileSync("alarmData.json"));

    for (let i = 0; i < data.length; i++) {
      alarmChannelID[i] = data[i]["channel"];
      alarmRoleID[i] = `<@&${data[i]["role"]}>`;
    }
    for (let k = 0; k < alarmChannelID.length; k++) {
      client.channels.cache
        .get(`${alarmChannelID[k]}`)
        .send(message_MON_55(alarmRoleID[k]));
    }
  });
  cron.schedule(rule_MTTF_58(`MON`), () => {
    let data = JSON.parse(fs.readFileSync("alarmData.json"));

    for (let i = 0; i < data.length; i++) {
      alarmChannelID[i] = data[i]["channel"];
      alarmRoleID[i] = `<@&${data[i]["role"]}>`;
    }
    for (let k = 0; k < alarmChannelID.length; k++) {
      client.channels.cache
        .get(`${alarmChannelID[k]}`)
        .send(message_MON_58(alarmRoleID[k]));
    }
  });

  //! 화
  cron.schedule(rule_MTTF_55(`TUE`), () => {
    let data = JSON.parse(fs.readFileSync("alarmData.json"));

    for (let i = 0; i < data.length; i++) {
      alarmChannelID[i] = data[i]["channel"];
      alarmRoleID[i] = `<@&${data[i]["role"]}>`;
    }
    for (let k = 0; k < alarmChannelID.length; k++) {
      client.channels.cache
        .get(`${alarmChannelID[k]}`)
        .send(message_TUE_55(alarmRoleID[k]));
    }
  });
  cron.schedule(rule_MTTF_58(`TUE`), () => {
    let data = JSON.parse(fs.readFileSync("alarmData.json"));

    for (let i = 0; i < data.length; i++) {
      alarmChannelID[i] = data[i]["channel"];
      alarmRoleID[i] = `<@&${data[i]["role"]}>`;
    }
    for (let k = 0; k < alarmChannelID.length; k++) {
      client.channels.cache
        .get(`${alarmChannelID[k]}`)
        .send(message_TUE_58(alarmRoleID[k]));
    }
  });

  //! 수 (5개)

  cron.schedule(rule_WED_11_55, () => {
    let data = JSON.parse(fs.readFileSync("alarmData.json"));

    for (let i = 0; i < data.length; i++) {
      alarmChannelID[i] = data[i]["channel"];
      alarmRoleID[i] = `<@&${data[i]["role"]}>`;
    }
    for (let k = 0; k < alarmChannelID.length; k++) {
      client.channels.cache
        .get(`${alarmChannelID[k]}`)
        .send(message_WED_55(alarmRoleID[k]));
    }
  });
  cron.schedule(rule_WED_11_58, () => {
    let data = JSON.parse(fs.readFileSync("alarmData.json"));

    for (let i = 0; i < data.length; i++) {
      alarmChannelID[i] = data[i]["channel"];
      alarmRoleID[i] = `<@&${data[i]["role"]}>`;
    }
    for (let k = 0; k < alarmChannelID.length; k++) {
      client.channels.cache
        .get(`${alarmChannelID[k]}`)
        .send(message_WED_58(alarmRoleID[k]));
    }
  });

  cron.schedule(rule_WED_13_55, () => {
    let data = JSON.parse(fs.readFileSync("alarmData.json"));

    for (let i = 0; i < data.length; i++) {
      alarmChannelID[i] = data[i]["channel"];
      alarmRoleID[i] = `<@&${data[i]["role"]}>`;
    }
    for (let k = 0; k < alarmChannelID.length; k++) {
      client.channels.cache
        .get(`${alarmChannelID[k]}`)
        .send(message_WED_55(alarmRoleID[k]));
    }
  });
  cron.schedule(rule_WED_13_58, () => {
    let data = JSON.parse(fs.readFileSync("alarmData.json"));

    for (let i = 0; i < data.length; i++) {
      alarmChannelID[i] = data[i]["channel"];
      alarmRoleID[i] = `<@&${data[i]["role"]}>`;
    }
    for (let k = 0; k < alarmChannelID.length; k++) {
      client.channels.cache
        .get(`${alarmChannelID[k]}`)
        .send(message_WED_58(alarmRoleID[k]));
    }
  });

  cron.schedule(rule_WED_19_55, () => {
    let data = JSON.parse(fs.readFileSync("alarmData.json"));

    for (let i = 0; i < data.length; i++) {
      alarmChannelID[i] = data[i]["channel"];
      alarmRoleID[i] = `<@&${data[i]["role"]}>`;
    }
    for (let k = 0; k < alarmChannelID.length; k++) {
      client.channels.cache
        .get(`${alarmChannelID[k]}`)
        .send(message_WED_55(alarmRoleID[k]));
    }
  });
  cron.schedule(rule_WED_19_58, () => {
    let data = JSON.parse(fs.readFileSync("alarmData.json"));

    for (let i = 0; i < data.length; i++) {
      alarmChannelID[i] = data[i]["channel"];
      alarmRoleID[i] = `<@&${data[i]["role"]}>`;
    }
    for (let k = 0; k < alarmChannelID.length; k++) {
      client.channels.cache
        .get(`${alarmChannelID[k]}`)
        .send(message_WED_58(alarmRoleID[k]));
    }
  });

  cron.schedule(rule_WED_21_55, () => {
    let data = JSON.parse(fs.readFileSync("alarmData.json"));

    for (let i = 0; i < data.length; i++) {
      alarmChannelID[i] = data[i]["channel"];
      alarmRoleID[i] = `<@&${data[i]["role"]}>`;
    }
    for (let k = 0; k < alarmChannelID.length; k++) {
      client.channels.cache
        .get(`${alarmChannelID[k]}`)
        .send(message_WED_55(alarmRoleID[k]));
    }
  });
  cron.schedule(rule_WED_21_58, () => {
    let data = JSON.parse(fs.readFileSync("alarmData.json"));

    for (let i = 0; i < data.length; i++) {
      alarmChannelID[i] = data[i]["channel"];
      alarmRoleID[i] = `<@&${data[i]["role"]}>`;
    }
    for (let k = 0; k < alarmChannelID.length; k++) {
      client.channels.cache
        .get(`${alarmChannelID[k]}`)
        .send(message_WED_58(alarmRoleID[k]));
    }
  });

  cron.schedule(rule_WED_23_55, () => {
    let data = JSON.parse(fs.readFileSync("alarmData.json"));

    for (let i = 0; i < data.length; i++) {
      alarmChannelID[i] = data[i]["channel"];
      alarmRoleID[i] = `<@&${data[i]["role"]}>`;
    }
    for (let k = 0; k < alarmChannelID.length; k++) {
      client.channels.cache
        .get(`${alarmChannelID[k]}`)
        .send(message_WED_55(alarmRoleID[k]));
    }
  });
  cron.schedule(rule_WED_23_58, () => {
    let data = JSON.parse(fs.readFileSync("alarmData.json"));

    for (let i = 0; i < data.length; i++) {
      alarmChannelID[i] = data[i]["channel"];
      alarmRoleID[i] = `<@&${data[i]["role"]}>`;
    }
    for (let k = 0; k < alarmChannelID.length; k++) {
      client.channels.cache
        .get(`${alarmChannelID[k]}`)
        .send(message_WED_58(alarmRoleID[k]));
    }
  });

  //! 목
  cron.schedule(rule_MTTF_55(`THU`), () => {
    let data = JSON.parse(fs.readFileSync("alarmData.json"));

    for (let i = 0; i < data.length; i++) {
      alarmChannelID[i] = data[i]["channel"];
      alarmRoleID[i] = `<@&${data[i]["role"]}>`;
    }
    for (let k = 0; k < alarmChannelID.length; k++) {
      client.channels.cache
        .get(`${alarmChannelID[k]}`)
        .send(message_THU_55(alarmRoleID[k]));
    }
  });
  cron.schedule(rule_MTTF_58(`THU`), () => {
    let data = JSON.parse(fs.readFileSync("alarmData.json"));

    for (let i = 0; i < data.length; i++) {
      alarmChannelID[i] = data[i]["channel"];
      alarmRoleID[i] = `<@&${data[i]["role"]}>`;
    }
    for (let k = 0; k < alarmChannelID.length; k++) {
      client.channels.cache
        .get(`${alarmChannelID[k]}`)
        .send(message_THU_58(alarmRoleID[k]));
    }
  });

  //! 금
  cron.schedule(rule_MTTF_55(`FRI`), () => {
    let data = JSON.parse(fs.readFileSync("alarmData.json"));

    for (let i = 0; i < data.length; i++) {
      alarmChannelID[i] = data[i]["channel"];
      alarmRoleID[i] = `<@&${data[i]["role"]}>`;
    }
    for (let k = 0; k < alarmChannelID.length; k++) {
      client.channels.cache
        .get(`${alarmChannelID[k]}`)
        .send(message_FRI_55(alarmRoleID[k]));
    }
  });
  cron.schedule(rule_MTTF_58(`FRI`), () => {
    let data = JSON.parse(fs.readFileSync("alarmData.json"));

    for (let i = 0; i < data.length; i++) {
      alarmChannelID[i] = data[i]["channel"];
      alarmRoleID[i] = `<@&${data[i]["role"]}>`;
    }
    for (let k = 0; k < alarmChannelID.length; k++) {
      client.channels.cache
        .get(`${alarmChannelID[k]}`)
        .send(message_FRI_58(alarmRoleID[k]));
    }
  });

  //! 토
  cron.schedule(rule_Weekend_55(`FRI`), () => {
    let data = JSON.parse(fs.readFileSync("alarmData.json"));

    for (let i = 0; i < data.length; i++) {
      alarmChannelID[i] = data[i]["channel"];
      alarmRoleID[i] = `<@&${data[i]["role"]}>`;
    }
    for (let k = 0; k < alarmChannelID.length; k++) {
      client.channels.cache
        .get(`${alarmChannelID[k]}`)
        .send(message_SAT_55(alarmRoleID[k]));
    }
  });
  cron.schedule(rule_Weekend_58(`FRI`), () => {
    let data = JSON.parse(fs.readFileSync("alarmData.json"));

    for (let i = 0; i < data.length; i++) {
      alarmChannelID[i] = data[i]["channel"];
      alarmRoleID[i] = `<@&${data[i]["role"]}>`;
    }
    for (let k = 0; k < alarmChannelID.length; k++) {
      client.channels.cache
        .get(`${alarmChannelID[k]}`)
        .send(message_SAT_58(alarmRoleID[k]));
    }
  });

  cron.schedule(rule_MTTF_55(`SAT`), () => {
    let data = JSON.parse(fs.readFileSync("alarmData.json"));

    for (let i = 0; i < data.length; i++) {
      alarmChannelID[i] = data[i]["channel"];
      alarmRoleID[i] = `<@&${data[i]["role"]}>`;
    }
    for (let k = 0; k < alarmChannelID.length; k++) {
      client.channels.cache
        .get(`${alarmChannelID[k]}`)
        .send(message_SAT_55(alarmRoleID[k]));
    }
  });
  cron.schedule(rule_MTTF_58(`SAT`), () => {
    let data = JSON.parse(fs.readFileSync("alarmData.json"));

    for (let i = 0; i < data.length; i++) {
      alarmChannelID[i] = data[i]["channel"];
      alarmRoleID[i] = `<@&${data[i]["role"]}>`;
    }
    for (let k = 0; k < alarmChannelID.length; k++) {
      client.channels.cache
        .get(`${alarmChannelID[k]}`)
        .send(message_SAT_58(alarmRoleID[k]));
    }
  });

  //! 일

  cron.schedule(rule_Weekend_55(`SAT`), () => {
    let data = JSON.parse(fs.readFileSync("alarmData.json"));

    for (let i = 0; i < data.length; i++) {
      alarmChannelID[i] = data[i]["channel"];
      alarmRoleID[i] = `<@&${data[i]["role"]}>`;
    }
    for (let k = 0; k < alarmChannelID.length; k++) {
      client.channels.cache
        .get(`${alarmChannelID[k]}`)
        .send(message_SUN_55(alarmRoleID[k]));
    }
  });
  cron.schedule(rule_Weekend_58(`SAT`), () => {
    let data = JSON.parse(fs.readFileSync("alarmData.json"));

    for (let i = 0; i < data.length; i++) {
      alarmChannelID[i] = data[i]["channel"];
      alarmRoleID[i] = `<@&${data[i]["role"]}>`;
    }
    for (let k = 0; k < alarmChannelID.length; k++) {
      client.channels.cache
        .get(`${alarmChannelID[k]}`)
        .send(message_SUN_58(alarmRoleID[k]));
    }
  });

  cron.schedule(rule_MTTF_55(`SUN`), () => {
    let data = JSON.parse(fs.readFileSync("alarmData.json"));

    for (let i = 0; i < data.length; i++) {
      alarmChannelID[i] = data[i]["channel"];
      alarmRoleID[i] = `<@&${data[i]["role"]}>`;
    }
    for (let k = 0; k < alarmChannelID.length; k++) {
      client.channels.cache
        .get(`${alarmChannelID[k]}`)
        .send(message_SUN_55(alarmRoleID[k]));
    }
  });
  cron.schedule(rule_MTTF_58(`SUN`), () => {
    let data = JSON.parse(fs.readFileSync("alarmData.json"));

    for (let i = 0; i < data.length; i++) {
      alarmChannelID[i] = data[i]["channel"];
      alarmRoleID[i] = `<@&${data[i]["role"]}>`;
    }
    for (let k = 0; k < alarmChannelID.length; k++) {
      client.channels.cache
        .get(`${alarmChannelID[k]}`)
        .send(message_SUN_58(alarmRoleID[k]));
    }
  });
};

module.exports = { loaAlarm };
