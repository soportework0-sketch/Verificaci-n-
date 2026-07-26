const fs = require("fs");
const path = require("path");
const {
  SlashCommandBuilder,
  PermissionFlagsBits
} = require("discord.js");

const dataPath = path.join(__dirname, "..", "data", "servidores.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("reset")
    .setDescription("Elimina la configuración de verificación del servidor")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {

    if (!fs.existsSync(dataPath)) {
      return interaction.reply({
        content: "❌ No hay configuración para eliminar.",
        ephemeral: true
      });
    }

    const servidores = JSON.parse(fs.readFileSync(dataPath, "utf8"));

    if (!servidores[interaction.guild.id]) {
      return interaction.reply({
        content: "❌ Este servidor no tiene una configuración guardada.",
        ephemeral: true
      });
    }

    delete servidores[interaction.guild.id];

    fs.writeFileSync(dataPath, JSON.stringify(servidores, null, 2));

    await interaction.reply({
      content: "✅ La configuración de verificación fue eliminada correctamente.",
      ephemeral: true
    });
  }
};
