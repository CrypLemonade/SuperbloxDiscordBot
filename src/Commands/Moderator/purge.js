const {SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, ButtonBuilder, ActionRowBuilder, ButtonStyle} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
   .setName('purge', 'clearchat')
   .setDescription('Purges the chat')
   .addIntegerOption(options => options.setName('amount').setDescription('The amount of messages to purge').setMinValue(1).setMaxValue(100).setRequired(true))
   .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
   async execute(interaction) {
    let msgCnt = interaction.options.getInteger('amount');

    const purgeEmbed = new EmbedBuilder()
    .setTitle("**Purged Messages**")
    .setColor('Blurple')
    .setDescription(`**${msgCnt}** messages have been purged from the chat. :white_check_mark:`)
    .setThumbnail('https://cdn.discordapp.com/attachments/1207493772649177129/1208270416448327721/R.png?ex=65e2ac83&is=65d03783&hm=5130e035e02b040123cbb59108ef8e48e6cd69d1a250f4af5ddbea47e71a05bf&')
    .setTimestamp()
    .setFooter({text: 'Superblox Official Bot - 2024'})

    interaction.channel.bulkDelete(msgCnt)

    await interaction.reply({embeds: [purgeEmbed], ephemeral: true})
   }
}