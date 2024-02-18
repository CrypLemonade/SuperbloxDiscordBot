const {PermissionsBitField, EmbedBuilder, SlashCommandBuilder} = require('discord.js');
const warnSchema = require('../../Schemas/warnSchema.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('warn')
    .setDescription('warns a user')
    .addUserOption(option => option.setName('user').setDescription('user to warn').setRequired(true))
    .addStringOption(option => option.setName('reason').setDescription('reason for the warn').setRequired(false)),
    async execute (interaction) {
        if(!interaction.member.permissions.has(PermissionsBitField.Flags.KickMembers)) return await interaction.reply({ content: "Oh No! You dont have permission to run this command."});

        const {options, guildId, user} = interaction;
        const target = options.getUser('user');
        const reason = options.getString('reason');
        const userTag = `${target.username}`;

        try {
            let data = await warnSchema.findOne({
                GuildID: guildId,
                UserID: user.id,
            });
        
            if (!data) {
                data = new warnSchema({
                    GuildID: guildId,
                    UserID: user.id,
                    UserTag: userTag,
                    Content: [
                        {
                            ExecuterID: user.id,
                            ExecuterIDTag: userTag.tag,
                            Reason: reason
                        }
                    ],
                });
            } else {
                const warnContent = {
                    ExecuterID: user.id,
                    ExecuterTag: user.tag,
                    Reason: reason
                }
                data.Content.push(warnContent);
            }
            await data.save();
        } catch (error) {
            console.log(error);
        }
        
        
        

        const dmEmbed = new EmbedBuilder()
        .setColor('Blurple')
        .setTitle('**New Warning!**')
        .setDescription(`:white_check_mark: You have been warned in ${interaction.guild.name} by ${interaction.user.tag} for ${reason}`)

        const warnEmbed = new EmbedBuilder()
        .setColor('Blurple')
        .setTitle('**Successfully Warned!**')
        .setDescription(`:white_check_mark: ${target.tag} has successfully been warned for ${reason}`)

        target.send({embeds: [dmEmbed]}).catch(err => {
            return;
        })

        interaction.reply({embeds: [warnEmbed]})
    }
}