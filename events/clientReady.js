import { Client, Events, ActivityType } from 'discord.js';
import chalk from 'chalk';

export default {
    name: Events.ClientReady,
    once: true,
	 /**
     * @param {Client} client 
     */
    async execute(client) {

        client.user.setActivity({
            name: "b7k3",
            type: ActivityType.Playing,
            state: "b7k3",
            
        });

        console.log("🤖 |", chalk.green("Aplicação"), client.user.username, chalk.green("está online!"));

    }
};