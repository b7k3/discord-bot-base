import { JsonDatabase } from "wio.db";

const config = new JsonDatabase({ JsonDatabase: "database/config.json" });

export {
    config
}