import Service from "./app.js";
import "dotenv/config"; // No need for empty braces
import apiRouter from "./src/routes/index.js";

const service = new Service();

const startService = async () => {
  try {
    await service.addRouter("/", apiRouter);
    const port = process.env.PORT || 4000;
    await service.start(port);
  } catch (e) {
    console.error("Error starting service:", e);
  }
};
await startService();
