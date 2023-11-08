const { Client, GatewayIntentBits, IntentsBitField } = require("discord.js");
const {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
} = require("@discordjs/voice");
const { commands } = require("./src/commands");
const { searchLofi, connectDataBase } = require("./src/search_lofi");

require("dotenv").config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildVoiceStates,
  ],
});

client.once("ready", async () => {
  await connectDataBase();
  client.guilds.cache.forEach((guild) => {
    guild.commands.set(commands);
  });
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  const channel = interaction.member.voice.channel;
  const channelId = channel.id;
  const guildId = channel.guild.id;
  const adapterCreator = channel.guild.voiceAdapterCreator;
  const player = createAudioPlayer();
  const connection = joinVoiceChannel({
    channelId,
    guildId,
    adapterCreator,
  });

  if (interaction.commandName === "play") {
    if (!channel) {
      await interaction.reply(
        "You must be in a voice channel to use this command."
      );
      return;
    }

    let music = await searchLofi().then((data) => {
      return data[0];
    });

    const resource = createAudioResource(music.url);

    connection.subscribe(player);
    player.play(resource);

    await interaction.reply(`Playing ${music.title} in your channel!`);
  }
  if (interaction.commandName === "stop") {
    if (player.state.status === "idle") {
      await interaction.reply(
        "Não é possível parar a música, pois nenhuma música está sendo reproduzida."
      );
    } else {
      try {
        player.stop();
        await interaction.reply("Stopped music!");
      } catch (error) {
        console.error("Erro ao parar a música:", error);
        await interaction.reply(
          "Não foi possível parar a música devido a um erro."
        );
      }
    }
    return;
  }

  if (interaction.commandName === "pause") {
    if (player.state.status === "idle") {
      await interaction.reply(
        "Não é possível pausar a música, pois nenhuma música está sendo reproduzida."
      );
    } else {
      try {
        player.pause();
        await interaction.reply("Paused music!");
      } catch (error) {
        console.error("Erro ao pausar a música:", error);
        await interaction.reply(
          "Não foi possível pausar a música devido a um erro."
        );
      }
    }
    return;
  }

  if (interaction.commandName === "resume") {
    if (player.state.status === "idle") {
      await interaction.reply(
        "Não é possível retomar a música, pois nenhuma música está sendo reproduzida."
      );
    } else {
      try {
        player.unpause();
        await interaction.reply("Resumed music!");
      } catch (error) {
        console.error("Erro ao retomar a música:", error);
        await interaction.reply(
          "Não foi possível retomar a música devido a um erro."
        );
      }
    }
    return;
  }

  player.addListener("stateChange", async (_, newOne) => {
    if (newOne.status == "idle") {
      let music = await searchLofi().then((data) => {
        return data[0];
      });

      const resource = createAudioResource(music.url);

      connection.subscribe(player);
      player.play(resource);

      await interaction.editReply(`Playing ${music.title} in your channel!`);
    }
  });
});

client.login(process.env.TOKEN_AUTH);
