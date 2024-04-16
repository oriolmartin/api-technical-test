import { Request, Response, Router } from "express";
import User from "../models/user";
import {
  checkPassword,
  createPassword,
  generateJwt,
  getUser,
} from "../lib/user";

class LoginRoutes {
  router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }

  async login(req: Request, res: Response) {
    const user = await User.findOne({ email: req.body.email });

    if (!!user && checkPassword(user.password, req.body.password)) {
      res.json({ auth_token: generateJwt(user.id) });
    } else {
      res.status(403).json();
    }
  }

  async currentUser(req: Request, res: Response) {
    const currentUser = await getUser(req.headers.authorization);
    currentUser ? res.json({ user: currentUser }) : res.json();
  }

  async createUser(req: Request, res: Response) {
    try {
      const newUser = new User(req.body);
      newUser.password = createPassword(req.body.password);
      await newUser.save();
      res.json(newUser);
    } catch (e) {
      res.status(403).json(e);
    }
  }

  routes() {
    this.router.post("/", this.login);
    this.router.get("/current", this.currentUser);
    this.router.post("/create", this.createUser);
  }
}

export default new LoginRoutes().router;
