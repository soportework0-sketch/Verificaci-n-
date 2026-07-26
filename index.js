const {
    Client,
    GatewayIntentBits,
    Events,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");

const TOKEN = process.env.TOKEN; // Agrega el token en las variables de entorno
const ROLE_ID = "PON_AQUI_EL_ID_DEL_ROL_VERIFICADO";

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers
    ]
});

client.once(Events.ClientReady, () => {
    console.log(`✅ ${client.user.tag} está listo.`);
});

client.on(Events.InteractionCreate, async (interaction) => {

    if (interaction.isChatInputCommand()) {

        if (interaction.commandName === "verificacion") {

            const boton = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId("verificar")
                    .setLabel("✅ Verificarme")
                    .setStyle(ButtonStyle.Success)
            );

            await interaction.reply({
                content: "# ✞・𝗩𝗘𝗥𝗜𝗙𝗜𝗖𝗔𝗖𝗜𝗢́𝗡\n\nPulsa el botón para obtener acceso al servidor.",
                components: [boton]
            });

        }

    }

    if (interaction.isButton()) {

        if (interaction.customId === "verificar") {

            const rol = interaction.guild.roles.cache.get(ROLE_ID);

            if (!rol) {
                return interaction.reply({
                    content: "❌ No se encontró el rol.",
                    ephemeral: true
                });
            }

            if (interaction.member.roles.cache.has(ROLE_ID)) {
                return interaction.reply({
                    content: "✅ Ya estás verificado.",
                    ephemeral: true
                });
            }

            await interaction.member.roles.add(rol);

            await interaction.reply({
                content: "🎉 ¡Te has verificado correctamente!",
                ephemeral: true
            });

        }

    }

});

client.login(TOKEN);
