const { ApplicationCommandOptionType } = require("discord.js");
const commands = [
  {
    name: "play",
    description: "Play music in a voice channel",
    // options: [
    //   {
    //     name: "all",
    //     description: "Play lofi music",
    //     type: ApplicationCommandOptionType.Subcommand,
    //   },
    //   {
    //     name: "lofi-chillhop",
    //     description: "Play lofi music",
    //     type: ApplicationCommandOptionType.Subcommand,
    //   },
    //   {
    //     name: "lofi-calming",
    //     description: "Play lofi music",
    //     type: ApplicationCommandOptionType.Subcommand,
    //   },
    // ],
  },
  {
    name: "stop",
    description: "Stop music in a voice channel",
  },
  {
    name: "pause",
    description: "Pause music in a voice channel",
  },
  {
    name: "resume",
    description: "Resume music in a voice channel",
  },
];

module.exports = {
  commands,
};
