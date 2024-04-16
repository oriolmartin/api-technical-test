import { Request, Response, Router } from "express";
import User from "../models/user";
import { checkJwt, createPassword } from "../lib/user";

class UsersRoutes {
  router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }

  async getUsers(req: Request, res: Response) {
    try {
      if (!(await checkJwt(req.headers.authorization))) {
        res.status(403);
      }
      const users = await User.find();
      res.json(users);
    } catch (e) {
      res.status(403).json(e);
    }
  }

  async getUser(req: Request, res: Response) {
    try {
      if (!(await checkJwt(req.headers.authorization))) {
        res.status(403);
      }
      const user = await User.findById(req.params.id);
      res.json(user);
    } catch (e) {
      res.status(403).json(e);
    }
  }

  async updateUser(req: Request, res: Response) {
    try {
      if (!(await checkJwt(req.headers.authorization))) {
        res.status(403);
      }

      const password = req.body.password
        ? createPassword(req.body.password)
        : undefined;

      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        { ...req.body, password },
        { returnDocument: "after" }
      );
      res.json(updatedUser);
    } catch (e) {
      res.status(403).json(e);
    }
  }

  async deleteUser(req: Request, res: Response) {
    try {
      if (!(await checkJwt(req.headers.authorization))) {
        res.status(403);
      }
      await User.findByIdAndDelete(req.params.id);
      res.json();
    } catch (e) {
      res.status(403).json(e);
    }
  }

  routes() {
    this.router.get("/", this.getUsers);
    this.router.get("/:id", this.getUser);
    this.router.put("/:id", this.updateUser);
    this.router.delete("/:id", this.deleteUser);
  }
}

export default new UsersRoutes().router;
