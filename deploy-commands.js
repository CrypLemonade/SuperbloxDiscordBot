const fs = require("node:fs");
const path = require("node:path");
const { REST, Routes } = require("discord.js");
require("dotenv").config();

function getFiles(dir) {
  const files = fs.readdirSync(dir, {
    withFileTypes: true,
  });

  let commandFiles = [];

  for (const file of files) {
    if (file.isDirectory()) {
      commandFiles = [...commandFiles, ...getFiles(`${dir}/${file.name}`)];
    } else if (file.name.endsWith(".js")) {
      commandFiles.push(`${dir}/${file.name}`);
    }
  }
  return commandFiles;
}

let commands = [];
const commandFiles = getFiles("./src/commands");

for (const file of commandFiles) {
  const command = require(file);
  commands.push(command.data.toJSON());
}

const rest = new REST({ version: "9" }).setToken(process.env.TOKEN);

rest
  .put(Routes.applicationCommands(process.env.CLIENT_ID), { body: commands })
  .then(() =>
    (async () => {
      const chalk = (await import("chalk")).default;
      console.log(chalk.green("Successfully Registered Application Commands."));
    })()
  )
  .catch(console.error);
