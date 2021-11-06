const makeRole = async (message) => {
  await message.guild.roles
    .create({
      data: {
        name: "loaAlarm",
        color: "BLUE",
      },
      reason: "alarm to specific role",
    })
    .then(console.log(`역할 만듦.`))
    .catch(console.error);
};

module.exports = { makeRole };
