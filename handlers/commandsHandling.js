import { fileURLToPath, pathToFileURL } from 'url';
import { join, dirname } from 'path';
import fs from 'fs';
import { Collection, REST, Routes } from 'discord.js';
import chalk from 'chalk';
import ora from 'ora';

export default async (client) => {


    client.commands = new Collection();
    client.commandArray = [];

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);

    const foldersPath = join(__dirname, '../commands');
    const commandFolders = fs.readdirSync(foldersPath);

    for (const folder of commandFolders) {

        const commandsPath = join(foldersPath, folder);
        const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    
        if (commandFiles.length === 0) {
            return console.log('❗ |', chalk.yellow(`Nenhum comando encontrado na pasta:`), commandsPath);
        }
    
        for (const file of commandFiles) {
            const filePath = pathToFileURL(join(commandsPath, file)).href;
            const command = await import(filePath);
    
            if ('data' in command.default && 'execute' in command.default) {
                client.commands.set(command.default.data.name, command.default);
                client.commandArray.push(command.default.data.toJSON());
            } else {
                console.log('❗ |', chalk.yellow(`O comando`), filePath, chalk.yellow(`não possui uma propriedade "data" ou "execute" obrigatória.`));
            }
        }

    }


    const rest = new REST().setToken(process.env.TOKEN);

    try {
        const refreshCommands = ora(' | ' + chalk.yellow("Atualizando ") + client.commandArray.length + chalk.yellow(" comandos da aplicação")).start();

        const data = await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID),
            { body: client.commandArray },
        );

        refreshCommands.succeed(' | ' + data.length + chalk.yellow(" Comando's atualizado com sucesso!"));
    } catch (error) {
        console.error(error);
    }
};