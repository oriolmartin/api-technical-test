import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import UserRoutes from "./routes/users";
import LoginRoutes from "./routes/login";
import { CONFIG } from "./config";

class Server {
  app: express.Application;

  constructor() {
    this.app = express();
    this.config();
    this.routes();
  }

  config() {
    // Mongoose
    mongoose
      .connect(CONFIG.MONGODB_URL, {
        autoIndex: true,
        autoCreate: true,
      })
      .then(() => console.log("DB is connected"));

    // Port
    this.app.set("port", CONFIG.PORT);

    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));
    this.app.use(cors());
  }

  routes() {
    this.app.use("/login", LoginRoutes);
    this.app.use("/users", UserRoutes);
  }

  start() {
    this.app.listen(this.app.get("port"), () => {
      console.log("Server on port", this.app.get("port"));
    });
  }
}

const server = new Server();
server.start();
