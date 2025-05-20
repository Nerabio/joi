import { Request, Response } from "express";
import routes from "../decorators/routes.decorator";
import controller from "../decorators/controller.decorator";
import Get from "../decorators/get.decorator";

@controller("main")
export class Main {
  private static answer = {
    response: {
      text: "Здравствуйте! Это мы, хороводоведы.",
      tts: "Здравствуйте! Это мы, хоров+одо в+еды.",
      end_session: false,
    },
    version: "1.0",
  };

  @Get("/")
  getUsers(req: Request, res: Response): void {
    res.json(Main.answer);
  }
}
