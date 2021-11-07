const makeRole = async (message) => {
  if (!message.guild.roles.cache.find((role) => role.name === "loaAlarm")) {
    const temp = await message.guild.roles
      .create({
        name: "loaAlarm",
        color: "BLUE",
      })
      .then((data) => {
        // console.log(`RoleId for loaAlarm : ${data.id}`);
        return data.id;
      })
      .catch(console.error);

    return temp;
  }
};

module.exports = { makeRole };
