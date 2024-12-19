import { TelegramClient } from "telegram"
import { StringSession } from "telegram/sessions/index.js"
import chalk from "chalk";
import input from "input"

import 'dotenv/config';


const telegram = new TelegramClient(
    new StringSession(process.env.STRING_SESSION),
    parseInt(process.env.API_ID), 
    process.env.API_HASH,
    { connectionRetries: 5 }
);

async function startTelegramClient() {
    try {
        await telegram.start({
            phoneNumber: process.env.NUMBER,
            password: async () => await input.text(`[TELEGRAM] CONNECTION: ${process.env.NUMBER} => Insira sua senha: `),
            phoneCode: async () => await input.text(`[TELEGRAM] CONNECTION: ${process.env.NUMBER} => Insira o código recebido no seu telegram: `),
            onError: (err) => console.log(err)
        });
        console.log(chalk.blue("TELEGRAM") + " ===>> Conectado com sucesso!")
        console.log(chalk.blue("TELEGRAM") + " ===>> SESSION: " + chalk.green(telegram.session.save()))
    } catch (err) {
        console.log(`[TELEGRAM] CONNECTION: ${process.env.NUMBER} => Erro ao conectar: ${err}`);
    }
}


startTelegramClient();

export { telegram };