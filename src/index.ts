import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import UserRoutes from "./routes/users";
import LoginRoutes from "./routes/login";

class Server {
  app: express.Application;

  constructor() {
    this.app = express();
    this.config();
    this.routes();
  }

  config() {
    // Mongoose
    const MONGO_URI = "mongodb://localhost:27017/technical_test_api";
    mongoose
      .connect(process.env.MONGODB_URL || MONGO_URI, {
        autoIndex: true,
        autoCreate: true,
      })
      .then(() => console.log("DB is connected"));

    // Port
    this.app.set("port", process.env.PORT || 3001);

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
