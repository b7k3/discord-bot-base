import ms from "ms";
import { encrypt } from "aes-ecb";
import "dotenv/config"

export default async function handler(req, res) {
    const { key, exp, user } = req.query;

    if (!key || !exp || !user) {
        return res.status(400).json({ status: 400, error: "Bad request"})
    }

    if (process.env.SECRET_KEY !== key) {
        return res.status(400).json({ status: 400, error: "Bad request"})
    }

    const currentDate = new Date();
    const expirationDate = new Date(currentDate.getTime() + ms(String(exp)));
    const formattedExpirationDate = expirationDate.toISOString().slice(0, -5) + "Z";

    const obj = { exp: formattedExpirationDate, user: user }
    const stringObj = JSON.stringify(obj)
    
    const apiKey = encrypt(String(process.env.SECRET_KEY), stringObj)

    res.status(200).json({ status: 200, key: encodeURIComponent(apiKey) })

}