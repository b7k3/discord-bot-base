import { Client, SlashCommandBuilder, PermissionFlagsBits, MessageFlags } from "discord.js";

export default {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setDescription('ping command'),
    /**
    * @param {Client} client
    * @param {import('discord.js').Interaction} interaction
    */

    async execute(interaction, client) {

        interaction.reply({ content: "Pong", flags: MessageFlags.Ephemeral })
    }

}