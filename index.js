const express = require("express");
const fs = require("fs");
const path = require("path");
const {
  Client,
  Collection,
  GatewayIntentBits,
  Events
} = require("discord.js");

// =====================
// Servidor Express
// =====================
const app = express();

app.get("/", (req, res) => {
  res.send("🤖 DRAGONES BOT está en línea.");
});

const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log(`🌐 Servidor web activo en el puerto ${PORT}`);
});

// =====================
// Cliente Discord
// =====================
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers
  ]
});

client.commands = new Collection();

// =====================
// Cargar comandos
// =====================
const commandsPath = path.join(__dirname, "commands");

const commandFiles = fs
  .readdirSync(commandsPath)
  .filter(file => file.endsWith(".js"));

for (const file of commandFiles) {

  const filePath = path.join(commandsPath, file);
  const command = require(filePath);

  if ("data" in command && "execute" in command) {

    client.commands.set(command.data.name, command);

    console.log(`✅ Comando cargado: ${command.data.name}`);

  } else {

    console.log(`⚠ ${file} no tiene data o execute`);

  }

}

// =====================
// Bot listo
// =====================
client.once(Events.ClientReady, () => {

  console.log(`🤖 ${client.user.tag} conectado`);

});

// =====================
// Slash Commands
// =====================
client.on(Events.InteractionCreate, async interaction => {

  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) return;

  try {

    await command.execute(interaction);

  } catch (error) {

    console.error(error);

    if (interaction.replied || interaction.deferred) {

      await interaction.followUp({
        content: "❌ Ocurrió un error al ejecutar el comando.",
        ephemeral: true
      });

    } else {

      await interaction.reply({
        content: "❌ Ocurrió un error al ejecutar el comando.",
        ephemeral: true
      });

    }

  }

});

// =====================
// Botones
// =====================
client.on(Events.InteractionCreate, async interaction => {

  if (!interaction.isButton()) return;

  if (interaction.customId === "verificar") {

    const config = require("./data/servidores.json");

    const datos = config[interaction.guild.id];

    if (!datos) {

      return interaction.reply({
        content: "❌ Primero usa /setup",
        ephemeral: true
      });

    }

    const rol = interaction.guild.roles.cache.get(datos.rol);

    if (!rol) {

      return interaction.reply({
        content: "❌ No encontré el rol configurado.",
        ephemeral: true
      });

    }

    if (interaction.member.roles.cache.has(rol.id)) {

      return interaction.reply({
        content: "✅ Ya estás verificado.",
        ephemeral: true
      });

    }

    await interaction.member.roles.add(rol);

    await interaction.reply({
      content: "🎉 ¡Te verificaste correctamente!",
      ephemeral: true
    });

  }

});

// =====================
// Login
// =====================
client.login(process.env.TOKEN);
