const { Client, Events, Discord, REST, Routes, ActivityType, Presence, GatewayIntentBits, Partials, Collection, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
require('dotenv').config();
const colors = require('colors');
const fs = require('fs');
const mongoose = require('mongoose');
const mongoURL = process.env.MONGODB_URL;

// Defines client
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds
  ],
  partials: [
    Partials.User,
    Partials.Channel,
    Partials.GuildMember,
    Partials.Message
  ],
  allowedMentions: {
    parse:
      ["roles", "users", "everyone"],
    repliedUser: true
  }
});

// Commands Collection
client.commands = new Collection();
const commands = [];

// Commands Handling
fs.readdirSync('./src/Commands/').forEach(dir => {
  const CommandsFiles = fs.readdirSync(`./src/Commands/${dir}/`).filter(file => file.endsWith('.js'));

  for (const file of CommandsFiles) {
    const command = require(`./Commands/${dir}/${file}`);
    commands.push(command.data.toJSON());
    client.commands.set(command.data.name, command);
  }
});

// Slash Commands Registering
const rest = new REST({ version: '9' }).setToken(process.env.TOKEN);

try {
  console.log('Started refreshing global application (/) commands.'.yellow);

  (async () => {
    await rest.put(
      Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
      { body: client.commands.map(command => command.data.toJSON()) }
    );
  });

  console.log('Successfully reloaded global application (/) commands.'.green);
} catch (error) {
  console.error('Error refreshing global application (/) commands:'.red, error);
}
client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error('Error executing command:', error);
    await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
  }
});

// Command Logs
client.on(Events.InteractionCreate, async interaction => {

  if (!interaction) return;
  if (!interaction.isChatInputCommand()) return;
  else {
    const channel = await client.channels.cache.get('1208551360308711474');
    const server = interaction.guild.name;
    const user = interaction.user.username;
    const userID = interaction.user.id;

    const commandLogEmbed = new EmbedBuilder()
      .setColor('Blurple')
      .setTitle('✅ **A Command Has Been Executed!**')
      .addFields({ name: 'Channel', value: `${channel}` })
      .addFields({ name: 'Command Executed', value: `${interaction}` })
      .addFields({ name: 'Command Executed By', value: `${user} | ${userID}` })
      .setTimestamp()
      .setFooter({ text: 'Superblox Official Bot - 2024' })

    await channel.send({ embeds: [commandLogEmbed] });
  }

})

// Client Ready Event
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`.magenta);
  console.log(`Currently in: ${client.guilds.cache.size} Guild`.blue);
  client.user.setPresence({
    activities: [{ name: `Superblox CCTV`, type: ActivityType.Watching }],
  });
  client.user.setStatus('dnd');

  
    if (!mongoURL) return;

    mongoose.connect(mongoURL);

    if(mongoose.connect) {
      console.log('MongoDB Connected'.green);
    } else {
      console.log('MongoDB Not Connected'.red);
    }

});


// Client Login
client.login(process.env.TOKEN);