import { Request, Response } from "express";
import { Post, Get, controller } from "../decorators/routes.decorator";

@controller("/")
export class Main {
  private static answer = {
    response: {
      text: "Здравствуйте! Это мы, хороводоведы.",
      tts: "Здравствуйте! Это мы, хоров+одо в+еды.",
      end_session: false,
    },
    version: "1.0",
  };

  @Post("/main")
  getUsers(req: Request, res: Response): void {
    res.json(Main.answer);
  }

  @Get("/main")
  getIndex(req: Request, res: Response): void {
    res.json(Main.answer);
  }
}
