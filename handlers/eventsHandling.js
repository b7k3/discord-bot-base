import { fileURLToPath, pathToFileURL } from 'url';
import { join, dirname } from 'path';
import fs from 'fs';

export default async (client) => {

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);

    const eventsPath = join(__dirname, '../events');

    const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

    for (const file of eventFiles) {
        const filePath = pathToFileURL(join(eventsPath, file)).href;
        const event = await import(filePath);
        if (event.default.once) {
            client.once(event.default.name, (...args) => event.default.execute(...args, client));
        } else {
            client.on(event.default.name, (...args) => event.default.execute(...args, client));
        }
    }
};
