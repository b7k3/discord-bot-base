import { JsonDatabase } from "wio.db";

const config = new JsonDatabase({ databasePath: "database/config.json" });

export {
    config
}
