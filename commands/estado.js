const fs = require("fs");
const path = require("path");
const { SlashCommandBuilder } = require("discord.js");

const dataPath = path.join(__dirname, "..", "data", "servidores.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("estado")
    .setDescription("Comprueba si un usuario está verificado")
    .addUserOption(option =>
      option
        .setName("usuario")
        .setDescription("Usuario a comprobar")
        .setRequired(true)
    ),

  async execute(interaction) {
    if (!fs.existsSync(dataPath)) {
      return interaction.reply({
        content: "❌ No hay configuración para este servidor.",
        ephemeral: true
      });
    }

    const servidores = JSON.parse(fs.readFileSync(dataPath, "utf8"));
    const config = servidores[interaction.guild.id];

    if (!config) {
      return interaction.reply({
        content: "❌ Este servidor no está configurado.",
        ephemeral: true
      });
    }

    const usuario = interaction.options.getMember("usuario");

    if (!usuario) {
      return interaction.reply({
        content: "❌ No encontré a ese usuario en el servidor.",
        ephemeral: true
      });
    }

    const verificado = usuario.roles.cache.has(config.roleId);

    await interaction.reply({
      content: verificado
        ? `✅ **${usuario.user.tag}** está verificado.`
        : `❌ **${usuario.user.tag}** no está verificado.`,
      ephemeral: true
    });
  }
};
