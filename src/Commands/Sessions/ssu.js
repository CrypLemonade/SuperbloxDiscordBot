const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
        data: new SlashCommandBuilder()
                .setName('ssu')
                .setDescription('hosts an ssu'),
        async execute(interaction) {

                if (interaction.member.roles.cache.some(role => role.id === '1208282949624275036')) {
                        const ssuEmbed = new EmbedBuilder()
                                .setColor('Blurple')
                                .setTitle("**SSU Being Hosted**")
                                .setAuthor({ name: `${interaction.user.username}`, iconURL: `${interaction.user.displayAvatarURL({ dynamic: true })}` })
                                .setDescription('```An SSU has been hosted! Make sure to try your best to get on game and have some fun! We look forward to seeing you!```')
                                .setThumbnail('https://media.discordapp.net/attachments/1198078340624556153/1207114258790223902/Untitled-7-transformed.png?ex=65de77c2&is=65cc02c2&hm=8367483c13f715b03ef39e620f55286721140f0d31211b50717352da36acb99a&=&format=webp&quality=lossless&width=671&height=671')
                                .addFields({
                                        name: 'Hosted By:',
                                        value: `**${interaction.user.username}**`,
                                        inline: false
                                })
                                .addFields({
                                        name: 'Game Link:',
                                        value: 'https://www.roblox.com/games/12983396928/SB-Superblox',
                                        inline: false
                                })
                                .setFooter({ text: 'Superblox Official Bot - 2024' })
                                .setTimestamp()

                        await interaction.reply({ content: '@everyone', allowedMentions: { parse: ["everyone"] }, embeds: [ssuEmbed] });
                } else {
                        const errorEmbed = new EmbedBuilder()
                                .setColor('Red')
                                .setTitle('**Unable to Execute Command**')
                                .setDescription(`It seems like you do not have permission to use ${interaction}! If you believe this is a mistake, please contact an administrator.`)
                                .setThumbnail('https://cdn.discordapp.com/attachments/1208210503629807679/1208560675194929203/9636_Cross.png?ex=65e3bad6&is=65d145d6&hm=165ffa6433a7f853be365feed72e00107e17ae7139f2d6303a81465f86e412d3&')
                                .setFooter({ text: 'Superblox Official Bot - 2024' })
                        await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
                }


        }
}