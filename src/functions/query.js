import { telegram } from "./connection";
import { NewMessage } from "telegram/events";
import { clearText, removeWaterMark } from "./clearText";
import { JSONParse } from "./JSONParse";
import { EditedMessage } from "telegram/events/EditedMessage";

export async function consultar({ module, query, json }) {

//dsd

    await telegram.sendMessage("BINGSIXBOT", {
        message: `/${module} ${query}`
    });



    return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
            telegram.removeEventHandler(OnMsg, new NewMessage({}));
            reject(new Error("O servidor demorou demais para responder"));
        }, 29000);

        async function OnMsg(event) {
            const message = event.message;
            const textPure = message?.text ?? message?.message;
            const text = message && message.text ? message.text.toLowerCase() : message && message.message ? message.message.toLowerCase() : '';
            const msgMarked = await message.getReplyMessage();
            const msgMarkedText = msgMarked && msgMarked.text ? msgMarked.text.toLowerCase() : msgMarked && msgMarked.message ? msgMarked.message.toLowerCase() : '';
            const sender = await message.getSender();
            const senderId = sender && sender.username ? sender.username : '';
            const chat = await message.getChat();
            const chatId = chat && chat.username ? chat.username : '';

            if (module === "cpf") {
                await message.click({ text: "DATASUS SISREG-III" });
            }

            if (chatId === 'BINGSIXBOT' && senderId === 'BINGSIXBOT' && msgMarkedText.includes(`/${module.split("-")[0]} ${query}`) && textPure !== "**Consultando...**" && textPure !== "**Olá** Rob \n\n**- Para consultar selecione um base abaixo!**") {
               
                clearTimeout(timeout);

                await telegram.removeEventHandler(OnMsg, new NewMessage({}));

                if (String(textPure).includes("⚠️") || String(textPure).includes("ℹ️")) {
                    return reject(new Error("Consulta não encontrada!"));
                }

                if (message.media) {

                    if (!message.media.hasOwnProperty("photo") && !message.media.hasOwnProperty("document")) {
                        const text = await clearText(textPure)
                        const formated = await JSONParse({ string: text, module: module })
                        return resolve(json ? formated : await removeWaterMark(textPure))
                    }

                    if (message.media.hasOwnProperty("photo")) {
                        const buffer = await telegram.downloadMedia(message, {});
                        let base64String = buffer.toString('base64');

                        if (module === "foto-rj") {
                            const text = await clearText(textPure)
                            const json = await JSONParse({ module: module, string: text })

                            json["FOTO"] = base64String

                            return resolve(json);
                        } else {
                            resolve({ FOTO: base64String })
                        }
                    }

                    if (message.media.hasOwnProperty("document")) {

                        const buffer = await telegram.downloadMedia(message, {});
                        let buff = Buffer.from(buffer, 'base64');

                        let textFile = buff.toString();
                        const text = await clearText(textFile)


                        switch (module) {

                            case "cpf4": {
                                const formated = await JSONParse({ string: text, module: module })
                                return resolve(json ? formated : await removeWaterMark(textFile))
                            }

                            case "nascimento": {
                                const formated = await JSONParse({ string: text, module: module })

                                return resolve(json ? formated : await removeWaterMark(textFile))
                            }


                            case "nome": {
                                const formated = await JSONParse({ string: text, module: module })
                                return resolve(json ? formated : await removeWaterMark(textFile))
                            }

                            case "nome3": {
                                const formated = await JSONParse({ string: text, module: module })
                                return resolve(json ? formated : await removeWaterMark(textFile))
                            }

                            case "cep": {

                                const basicInfo = await clearText(textPure)

                                const jsonQ = await JSONParse({ string: basicInfo, module: "cepBasic" })
                                const array = await JSONParse({ string: text, module: "cep" })
                                jsonQ["MORADORES"] = array
                                return resolve(json ? jsonQ : await removeWaterMark(textFile))
                            }


                            case "compras": {
                                const formated = await JSONParse({ string: text, module: module })
                                return resolve(json ? formated : await removeWaterMark(textFile))
                            }


                            default: {
                                return resolve(text)
                            }
                        }
                    }

                } else {
                    const text = await clearText(textPure)

                    switch (module) {

                        case "impostos": {
                            const formated = await JSONParse({ string: text, module: module })
                            return resolve(json ? formated : await removeWaterMark(textPure))
                        }

                        case "cpf4": {
                            const formated = await JSONParse({ string: text, module: module })
                            return resolve(json ? formated : await removeWaterMark(textPure))
                        }

                        case "email": {
                            const formated = await JSONParse({ string: text, module: module })
                            return resolve(json ? formated : await removeWaterMark(textPure))
                        }

                        case "score": {
                            const formated = await JSONParse({ string: text, module: module })
                            return resolve(json ? formated : await removeWaterMark(textPure))
                        }

                        case "nome": {
                            const formated = await JSONParse({ string: text, module: module })
                            return resolve(json ? formated : await removeWaterMark(textPure))
                        }

                        case "placa": {
                            const formated = await JSONParse({ string: text, module: module })
                            return resolve(json ? formated : await removeWaterMark(textPure))
                        }

                        case "chassi": {
                            const formated = await JSONParse({ string: text, module: module })
                            return resolve(json ? formated : await removeWaterMark(textPure))
                        }

                        case "nome3": {
                            const formated = await JSONParse({ string: text, module: module })
                            return resolve(json ? formated : await removeWaterMark(textPure))
                        }

                        case "telefone": {
                            const formated = await JSONParse({ string: text, module: module })
                            return resolve(json ? formated : await removeWaterMark(textPure))
                        }

                        case "internet": {
                            const formated = await JSONParse({ string: text, module: module })
                            return resolve(json ? formated : await removeWaterMark(textPure))
                        }

                        case "compras": {
                            const formated = await JSONParse({ string: text, module: module })
                            return resolve(json ? formated : await removeWaterMark(textPure))
                        }

                        case "cpf": {
                            const formated = await JSONParse({ string: text, module: module })
                            return resolve(json ? formated : await removeWaterMark(textPure))
                        }

                        case "rg": {
                            const formated = await JSONParse({ string: text, module: "cpf" })
                            return resolve(json ? formated : await removeWaterMark(textPure))
                        }

                        case "cpf2": {
                            const formated = await JSONParse({ string: text, module: module })
                            return resolve(json ? formated : await removeWaterMark(textPure))
                        }

                        case "telefone2": {
                            const formated = await JSONParse({ string: text, module: "telefone" })
                            return resolve(json ? formated : await removeWaterMark(textPure))
                        }

                        default: {
                            return resolve(await removeWaterMark(textPure))
                        }
                    }


                }

            }
        }

        async function OnMsgEdit(event) {
            const message = event.message;
            const textPure = message?.text ?? message?.message;
            const text = message && message.text ? message.text.toLowerCase() : message && message.message ? message.message.toLowerCase() : '';
            const msgMarked = await message.getReplyMessage();
            const msgMarkedText = msgMarked && msgMarked.text ? msgMarked.text.toLowerCase() : msgMarked && msgMarked.message ? msgMarked.message.toLowerCase() : '';
            const sender = await message.getSender();
            const senderId = sender && sender.username ? sender.username : '';
            const chat = await message.getChat();
            const chatId = chat && chat.username ? chat.username : '';

          

            if (chatId === 'BINGSIXBOT' && senderId === 'BINGSIXBOT' && msgMarkedText.includes(`/${module.split("-")[0]} ${query}`) && textPure !== "**Consultando...**" && textPure !== "**Olá** Rob \n\n**- Para consultar selecione um base abaixo!**") {
               
                clearTimeout(timeout);

                await telegram.removeEventHandler(OnMsgEdit, new EditedMessage({}));

                if (String(textPure).includes("⚠️") || String(textPure).includes("ℹ️")) {
                    return reject(new Error("Consulta não encontrada!"));
                }

                if (message.media) {

                    if (!message.media.hasOwnProperty("photo") && !message.media.hasOwnProperty("document")) {
                        const text = await clearText(textPure)
                        const formated = await JSONParse({ string: text, module: module })
                        return resolve(json ? formated : await removeWaterMark(textPure))
                    }

                    if (message.media.hasOwnProperty("photo")) {
                        const buffer = await telegram.downloadMedia(message, {});
                        let base64String = buffer.toString('base64');

                        if (module === "foto-rj") {
                            const text = await clearText(textPure)
                            const json = await JSONParse({ module: module, string: text })

                            json["FOTO"] = base64String

                            return resolve(json);
                        } else {
                            resolve({ FOTO: base64String })
                        }
                    }

                    if (message.media.hasOwnProperty("document")) {

                        const buffer = await telegram.downloadMedia(message, {});
                        let buff = Buffer.from(buffer, 'base64');

                        let textFile = buff.toString();
                        const text = await clearText(textFile)


                        switch (module) {

                            case "cpf4": {
                                const formated = await JSONParse({ string: text, module: module })
                                return resolve(json ? formated : await removeWaterMark(textFile))
                            }

                            case "nascimento": {
                                const formated = await JSONParse({ string: text, module: module })

                                return resolve(json ? formated : await removeWaterMark(textFile))
                            }


                            case "nome": {
                                const formated = await JSONParse({ string: text, module: module })
                                return resolve(json ? formated : await removeWaterMark(textFile))
                            }

                            case "nome3": {
                                const formated = await JSONParse({ string: text, module: module })
                                return resolve(json ? formated : await removeWaterMark(textFile))
                            }

                            case "cep": {

                                const basicInfo = await clearText(textPure)

                                const jsonQ = await JSONParse({ string: basicInfo, module: "cepBasic" })
                                const array = await JSONParse({ string: text, module: "cep" })
                                jsonQ["MORADORES"] = array
                                return resolve(json ? jsonQ : await removeWaterMark(textFile))
                            }


                            case "compras": {
                                const formated = await JSONParse({ string: text, module: module })
                                return resolve(json ? formated : await removeWaterMark(textFile))
                            }


                            default: {
                                return resolve(text)
                            }
                        }
                    }

                } else {
                    const text = await clearText(textPure)

                    switch (module) {

                        case "impostos": {
                            const formated = await JSONParse({ string: text, module: module })
                            return resolve(json ? formated : await removeWaterMark(textPure))
                        }

                        case "cpf4": {
                            const formated = await JSONParse({ string: text, module: module })
                            return resolve(json ? formated : await removeWaterMark(textPure))
                        }

                        case "email": {
                            const formated = await JSONParse({ string: text, module: module })
                            return resolve(json ? formated : await removeWaterMark(textPure))
                        }

                        case "score": {
                            const formated = await JSONParse({ string: text, module: module })
                            return resolve(json ? formated : await removeWaterMark(textPure))
                        }

                        case "nome": {
                            const formated = await JSONParse({ string: text, module: module })
                            return resolve(json ? formated : await removeWaterMark(textPure))
                        }

                        case "placa": {
                            const formated = await JSONParse({ string: text, module: module })
                            return resolve(json ? formated : await removeWaterMark(textPure))
                        }

                        case "chassi": {
                            const formated = await JSONParse({ string: text, module: module })
                            return resolve(json ? formated : await removeWaterMark(textPure))
                        }

                        case "nome3": {
                            const formated = await JSONParse({ string: text, module: module })
                            return resolve(json ? formated : await removeWaterMark(textPure))
                        }

                        case "telefone": {
                            const formated = await JSONParse({ string: text, module: module })
                            return resolve(json ? formated : await removeWaterMark(textPure))
                        }

                        case "internet": {
                            const formated = await JSONParse({ string: text, module: module })
                            return resolve(json ? formated : await removeWaterMark(textPure))
                        }

                        case "compras": {
                            const formated = await JSONParse({ string: text, module: module })
                            return resolve(json ? formated : await removeWaterMark(textPure))
                        }

                        case "cpf": {
                            const formated = await JSONParse({ string: text, module: module })
                            return resolve(json ? formated : await removeWaterMark(textPure))
                        }

                        case "rg": {
                            const formated = await JSONParse({ string: text, module: "cpf" })
                            return resolve(json ? formated : await removeWaterMark(textPure))
                        }

                        case "cpf2": {
                            const formated = await JSONParse({ string: text, module: module })
                            return resolve(json ? formated : await removeWaterMark(textPure))
                        }

                        case "telefone2": {
                            const formated = await JSONParse({ string: text, module: "telefone" })
                            return resolve(json ? formated : await removeWaterMark(textPure))
                        }

                        default: {
                            return resolve(await removeWaterMark(textPure))
                        }
                    }
                }
            }
        }

        telegram.addEventHandler(OnMsgEdit, new EditedMessage({}));
        telegram.addEventHandler(OnMsg, new NewMessage({}));
    })

}
