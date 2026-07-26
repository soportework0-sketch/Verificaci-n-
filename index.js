const express = require("express");
const {
    Client,
    GatewayIntentBits,
    Events,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");

// ===== Servidor Express =====
const app = express();

app.get("/", (req, res) => {
    res.send("🤖 DRAGONES BOT está en línea.");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🌐 Servidor web activo en el puerto ${PORT}`);
});

// ===== Configuración del Bot =====
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers
    ]
});

const TOKEN = process.env.TOKEN;

// Coloca aquí el ID del rol de verificado
const ROLE_ID = "PON_AQUI_EL_ID_DEL_ROL";

client.once(Events.ClientReady, () => {
    console.log(`✅ ${client.user.tag} está listo.`);
});

client.on(Events.InteractionCreate, async (interaction) => {

    // Comando /verificacion
    if (interaction.isChatInputCommand()) {

        if (interaction.commandName === "verificacion") {

            const fila = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId("verificar")
                    .setLabel("✅ Verificarme")
                    .setStyle(ButtonStyle.Success)
            );

            await interaction.reply({
                content:
`# ✞・𝗩𝗘𝗥𝗜𝗙𝗜𝗖𝗔𝗖𝗜𝗢́𝗡

Pulsa el botón para verificarte y acceder al servidor.`,
                components: [fila]
            });
        }
    }

    // Botón
    if (interaction.isButton()) {

        if (interaction.customId === "verificar") {

            const rol = interaction.guild.roles.cache.get(ROLE_ID);

            if (!rol) {
                return interaction.reply({
                    content: "❌ No encontré el rol configurado.",
                    ephemeral: true
                });
            }

            if (interaction.member.roles.cache.has(ROLE_ID)) {
                return interaction.reply({
                    content: "✅ Ya estás verificado.",
                    ephemeral: true
                });
            }

            try {
                await interaction.member.roles.add(rol);

                await interaction.reply({
                    content: "🎉 ¡Te has verificado correctamente!",
                    ephemeral: true
                });

            } catch (err) {

                console.error(err);

                await interaction.reply({
                    content: "❌ No pude asignarte el rol.",
                    ephemeral: true
                });
            }
        }
    }

});

client.login(TOKEN);
