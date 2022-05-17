const { CommandInteraction, MessageEmbed } = require("discord.js");

module.exports = {
  name: "music",
  description: "Complete music system",
  permission: "ADMINSTRATOR",
  options: [
    {
      name: "play",
      description: "Play a song",
      type: "SUB_COMMAND",
      options: [{ name: "query", description: "Provie a name or a url for the song", type: "STRING", required: true}]
    },
    {
      name: "settings",
      description: "Select an option.",
      type: "SUB_COMMAND",
      options: [{ name: "options", description: "Select an option.", type: "STRING", required: true,
      choices: [
        {name : "queue", value: "queue"},
        {name : "skip", value: "skip"},
        {name : "pause", value: "pause"},
        {name : "resume", value: "resume"},
        {name : "stop", value: "stop"},
      ]}]
    }
  ],
  /**
   * @param {CommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const { options, member, guild, channel } = interaction;
    const VoiceChannel = member.voice.channel;

    if(!VoiceChannel)
      return interaction.reply({content: "You must be in a voice channel", ephemeral: true});

    if(guild.me.voice.channelId && VoiceChannel.id !== guild.me.voice.channelId)
      return interaction.reply({content: `I'm already playing music in <#${guild.me.vocie.channelId}>.`, ephemeral: true});

    try {
      switch(options.getSubcommand()) {
        case "play": {
          client.distube.playVoiceChannel( VoiceChannel, options.getString("query"), { textChannel: channel, member: member});
          return interaction.reply({content: "Request recieved."});
        }
        case "settings" : {
          const queue = await client.distube.getQueue(VoiceChannel);

          if(!queue)
          return interaction.reply({content: "There is no queue."})

          switch(options.getString("options")) {
            case "skip" :
              await queue.skip(VoiceChannel);
              return interaction.reply({content: "Song has been skipped"})

            case "stop" :
              await queue.stop(VoiceChannel);
              return interaction.reply({content: "Music has been stopped."})

            case "pause" :
              await queue.pause(VoiceChannel);
              return interaction.reply({content: "Song has been paused."})

            case "resume" :
              await queue.resume(VoiceChannel);
              return interaction.reply({content: "Song has been resumed."})

            case "queue" :
              return interaction.reply({embeds: [new MessageEmbed()
                .setColor("#8B00FF")
                .setDescription(
                  `${queue.songs.map(
                    (song, id) => `\n**${id + 1}**. ${song.name} - \`${song.formattedDuration}\``
                  )}`
                )]})
          }
          return;
        }
      }
    } catch(error) {
      const errorEmbed = new MessageEmbed()
      .setColor("#8B00FF")
      .setDescription(
        `에러 발생 : ${error}`
      );

      return interaction.reply({embeds: [errorEmbed]});
    }
  }
}