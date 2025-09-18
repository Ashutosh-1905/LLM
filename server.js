import { config as conf } from "dotenv";
conf();

import app from "./src/app.js";
import config from "./src/config/config.js";
import connetDb from "./src/config/connectDb.js";


const PORT = config.port || 4000;

const startServer = async () => {
  try {
    await connetDb();
    app.listen(PORT, () => {
      console.log(`server is running on port: ${PORT}`);
    });
  } catch (err) {
    console.log("Failed to start server: ", err);
  }
};

startServer();