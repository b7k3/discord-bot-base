import { Client, Events } from 'discord.js';

export default {
    name: Events.InteractionCreate,
    /**
    * @param {Client} client
    * @param {import('discord.js').Interaction} interaction
    */
    async execute(interaction, client) {

        if (interaction.isChatInputCommand()) {
            const command = interaction.client.commands.get(interaction.commandName);
            if (!command) {
                return;
            }

            try {
                await command.execute(interaction);
            } catch (error) {
                console.error(error);
            }
        }

        if (interaction.isAutocomplete()) {
            const command = interaction.client.commands.get(interaction.commandName);
            if (!command) {
                return;
            }
            try {
                await command.autocomplete(interaction);
            } catch (err) {
                console.error(err)
            }
        }


    }
};