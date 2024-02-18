const {PermissionsBitField, EmbedBuilder, SlashCommandBuilder} = require('discord.js');
const warnSchema = require('../../Schemas/warnSchema.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('clearwarn')
    .setDescription('clears a user warn')
    .addUserOption(option => option.setName('user').setDescription('user to clear warnings from').setRequired(true)),
    async execute (interaction) {
        if(!interaction.member.permissions.has(PermissionsBitField.Flags.KickMembers)) return await interaction.reply({ content: "Oh No! You dont have permission to run this command."});

        const {options, guildId, user} = interaction;
        const target = options.getUser('user');

        const clearEmbed = new EmbedBuilder()

        try {

            const data = await warnSchema.findOneAndDelete({
                GuildID: guildId,
                UserID: target.id,
                UserTag: target.tag
              });

                if(data) {
                    embed.setColor('Blurple')
                    .setDescription(`:white_check_mark: ${target.tag}'s warnings have been cleared.`)
    
                    interaction.reply({embeds: [clearEmbed]})
                } else {
                    interaction.reply({content: `${target.tag} has no warnings to clear.`, ephemeral: true})
                }
        } catch (error) {
            console.log(error);
        }

    }
}