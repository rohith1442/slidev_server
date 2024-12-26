import express, { json, urlencoded } from "express";
import path from "path"; 
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default class Service {
  constructor() {
    this.app = express();
    this.app.use(json({ limit: "10mb" }));
    this.app.use(urlencoded({ extended: true }));
    this.app.use(express.static(path.join(__dirname, "dist")));
  }


  addRoute(method, path, handler) {
    this.app[method.toLowerCase()](path, async (req, res, next) => {
      try {
        const result = await handler(req, res);
        res.json(result);
      } catch (err) {
        next(err);
      }
    });
  }

  async addRouter(path, router) {
    this.app.use(path, router);
  }

  async listen(port) {
    this.app.listen(port, (err) => {
      if (err) {
        console.error("Error starting server:", err);
      } else {
        console.log(`Listening on port ${port}`);
      }
    });
  }

  async start(port) {
    try {
      this.addRoute("get", "/test", async (req, res) => {
        return { message: "API is working!" };
      });

      await this.listen(port);
    } catch (err) {
      console.error("Error starting the service:", err);
      throw err;
    }
  }
}
