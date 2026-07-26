const fs = require("fs");
const path = require("path");
const {
  SlashCommandBuilder,
  PermissionFlagsBits
} = require("discord.js");

const dataPath = path.join(__dirname, "..", "data", "servidores.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("setup")
    .setDescription("Configura el rol de verificación del servidor")
    .addRoleOption(option =>
      option
        .setName("rol")
        .setDescription("Rol que recibirán los usuarios verificados")
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    const rol = interaction.options.getRole("rol");

    let servidores = {};

    if (fs.existsSync(dataPath)) {
      servidores = JSON.parse(fs.readFileSync(dataPath, "utf8"));
    }

    servidores[interaction.guild.id] = {
      roleId: rol.id
    };

    fs.writeFileSync(dataPath, JSON.stringify(servidores, null, 2));

    await interaction.reply({
      content: `✅ El rol de verificación se configuró correctamente: **${rol.name}**`,
      ephemeral: true
    });
  }
};
