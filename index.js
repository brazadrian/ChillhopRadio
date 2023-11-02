const { Client, GatewayIntentBits, IntentsBitField } = require("discord.js");
const {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
} = require("@discordjs/voice");
const { join } = require("node:path");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildVoiceStates,
  ],
});

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.once("ready", () => {
  const commands = [
    {
      name: "play",
      description: "Play music in a voice channel",
    },
  ];

  client.guilds.cache.forEach((guild) => {
    guild.commands.set(commands);
  });
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  if (interaction.commandName === "play") {
    const channel = interaction.member.voice.channel;
    if (!channel) {
      await interaction.reply(
        "You must be in a voice channel to use this command."
      );
      return;
    }

    const channelId = channel.id;
    const guildId = channel.guild.id;
    const adapterCreator = channel.guild.voiceAdapterCreator;

    const connection = joinVoiceChannel({
      channelId,
      guildId,
      adapterCreator,
    });

    const resource = createAudioResource(
      join(__dirname, "src/audios/lofi_music.mp3")
    );
    console.log(resource);
    const player = createAudioPlayer();
    player.play(resource);

    connection.subscribe(player);

    await interaction.reply("Playing lofi music in your channel!");
  }
});

client.login(process.env.TOKEN);
