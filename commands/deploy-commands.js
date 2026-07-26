const { REST, Routes } = require("discord.js");
const fs = require("fs");
const path = require("path");

// Token del bot (debe estar en las variables de entorno de Render)
const TOKEN = process.env.TOKEN;

// IDs
const CLIENT_ID = "1490457798973198508";
const GUILD_ID = "1530695397847339018";

// Cargar todos los comandos
const commands = [];
const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs
  .readdirSync(commandsPath)
  .filter(file => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(path.join(commandsPath, file));

  if ("data" in command && "execute" in command) {
    commands.push(command.data.toJSON());
  } else {
    console.log(`⚠️ El comando ${file} no tiene "data" o "execute".`);
  }
}

// Registrar comandos
const rest = new REST({ version: "10" }).setToken(TOKEN);

(async () => {
  try {
    console.log(`🔄 Registrando ${commands.length} comandos...`);

    await rest.put(
      Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
      { body: commands }
    );

    console.log("✅ Comandos registrados correctamente.");
  } catch (error) {
    console.error("❌ Error al registrar comandos:");
    console.error(error);
  }
})();
