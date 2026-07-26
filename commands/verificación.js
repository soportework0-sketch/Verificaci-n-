const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("verificacion")
    .setDescription("Envía el panel de verificación"),

  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setTitle("✞・𝗩𝗘𝗥𝗜𝗙𝗜𝗖𝗔𝗖𝗜𝗢́𝗡")
      .setDescription(
        "Pulsa el botón de abajo para verificarte y obtener acceso al servidor."
      )
      .setColor("Green")
      .setFooter({
        text: "DRAGONES BOT"
      });

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("verificar")
        .setLabel("✅ Verificarme")
        .setStyle(ButtonStyle.Success)
    );

    await interaction.reply({
      embeds: [embed],
      components: [row]
    });
  }
};
