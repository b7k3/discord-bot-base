import dotenv from 'dotenv';
import { Client, GatewayIntentBits } from 'discord.js';
import path from 'path';
import fs from 'fs';
import chalk from 'chalk';
import { pathToFileURL } from 'url';

dotenv.config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildVoiceStates
    ]
});

const loadHandlers = async () => {
    const handlersPath = path.resolve('./handlers');

    const handlers = fs.readdirSync(handlersPath).filter(file => file.endsWith('.js'));
    for (const file of handlers) {
        const handler = await import(pathToFileURL(path.join(handlersPath, file)).href);
        handler.default(client);
    }
};

(async () => {
    await loadHandlers();
    
    client.login(process.env.TOKEN).catch(err => {
        throw new Error(err);
    });
})();