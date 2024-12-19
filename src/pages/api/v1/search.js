import { checkModule } from "@/functions/checkModules";
import { consultar } from "@/functions/query";
import { decrypt } from "aes-ecb";
import "dotenv/config";

export default async function handler(req, res) {
    const { module, key, q, json } = req.query;

    if (!module || !q || !key || !json) {
        return res.status(400).json({ status: 400, error: "Bad request" })
    }

    if (json !== 'true' && json !== 'false') {
        return res.status(400).json({ status: 400, error: "Bad request" })
    }

    try {
        const keyData = decrypt(process.env.SECRET_KEY, decodeURIComponent(key))

        if (!keyData) {
            return res.status(400).json({ status: 400, error: "Forbidden" })
        }

        var jsonDataInfo = JSON.parse(keyData)

        const dataAtual = new Date();
        const expiration = new Date(jsonDataInfo.exp);

        if (expiration < dataAtual) {
            return res.status(400).json({ status: 400, error: "Expired key" })
        }
    } catch (err) {
        return res.status(400).json({ status: 400, error: "Forbidden" })
    }

    const checkMod = await checkModule({ module: module })

    if (!checkMod) {
        return res.status(400).json({ status: 400, error: "Module not found" })
    }

    const jsonAsBoolean = (json === 'true');

    
    consultar({ module: String(module).toLowerCase(), query: String(q).toLowerCase(), json: jsonAsBoolean }).then(r => {
       
        return res.status(200).json({ status: 200, data: r })
    }).catch(err => {
        res.status(500).json({ status: 500, error: err.message })
    })

}