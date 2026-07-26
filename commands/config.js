const fs = require("fs");
const path = require("path");
const { SlashCommandBuilder } = require("discord.js");

const dataPath = path.join(__dirname, "..", "data", "servidores.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("config")
    .setDescription("Muestra la configuración del sistema de verificación"),

  async execute(interaction) {
    if (!fs.existsSync(dataPath)) {
      return interaction.reply({
        content: "❌ No hay ninguna configuración guardada.",
        ephemeral: true
      });
    }

    const servidores = JSON.parse(fs.readFileSync(dataPath, "utf8"));
    const config = servidores[interaction.guild.id];

    if (!config) {
      return interaction.reply({
        content: "❌ Este servidor aún no está configurado.",
        ephemeral: true
      });
    }

    await interaction.reply({
      content: `⚙️ **Configuración actual**\n\n🎭 Rol de verificación: <@&${config.roleId}>`,
      ephemeral: true
    });
  }
};
