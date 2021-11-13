const fs = require("fs");

const makeRole = async (message) => {
  let json = JSON.parse(fs.readFileSync("alarmData.json"));
  let idList = [];
  for (let i = 0; i < json.length; i++) {
    idList[i] = json[i]["role"];
  }

  if (!message.guild.roles.cache.find((role) => role.id === idList)) {
    const temp = await message.guild.roles
      .create({
        name: "loaAlarm",
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
