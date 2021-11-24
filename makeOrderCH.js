const makeOrderChannel = async (message) => {
  const temp = await message.guild.channels
    .create("믹스테잎_명령", {
      type: "text",
      permissionOverwrites: [
        {
          id: message.guild.roles.everyone,
          allow: ["VIEW_CHANNEL"],
          deny: [],
        },
      ],
    })
    .then((result) => {
      // console.log(`this is channel ID : ${result.id}`);
      return result.id;
    });

  // console.log(`temp : ${temp}`);
  return temp;
};

module.exports = { makeOrderChannel };
