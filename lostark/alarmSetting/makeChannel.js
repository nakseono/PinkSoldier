const makeAlarmChannel = async (message) => {
  const temp = await message.guild.channels
    .create("로스트아크 알람", {
      type: "GUILD_TEXT",
      permissionOverwrites: [
        {
          id: message.guild.roles.everyone,
          allow: ["VIEW_CHANNEL"],
          deny: ["SEND_MESSAGES"],
        },
      ],
    })
    .then((result) => {
      console.log(`this is channel ID : ${result.id}`);
      return result.id;
    });

  // console.log(`temp : ${temp}`);
  return temp;
};

module.exports = { makeAlarmChannel };
