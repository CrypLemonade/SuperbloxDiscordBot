const {PermissionsBitField, EmbedBuilder, SlashCommandBuilder} = require('discord.js');
const warnSchema = require('../../Schemas/warnSchema.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('warnings')
    .setDescription('checks warnings')
    .addUserOption(option => option.setName('user').setDescription('user to check').setRequired(true)),
    async execute (interaction) {

        const {options, guildId, user} = interaction;
        const target = options.getUser('user');
        

        const warningsEmbed = new EmbedBuilder()
        const noWarns = new EmbedBuilder()


        try {
            const data = await warnSchema.findOneAndDelete({
                GuildID: guildId,
                UserID: target.id,
                UserTag: target.tag
            });
            
            if (data) {
                warningsEmbed.setColor('Blurple')
                .setDescription(`:white_check_mark: **${target.tag}'s** **Warnings:** \n${data.Content.map(
                    (w, i) => 
                        `
                        **Warning**: ${i + 1}
                        **Warning Reason**: ${w.Reason}
                        `
                ).join(`-`)}`)

                interaction.reply({embeds: [warningsEmbed]})
            } else {
                noWarns.setColor('Blurple')
               .setDescription(`:white_check_mark: ${target.tag} has **0** warnings logged.`)

               interaction.reply({embeds: [noWarns]})
            }
        } catch (error) {
            console.log(error);
        }

    }
}