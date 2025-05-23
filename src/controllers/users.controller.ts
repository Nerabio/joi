import { Request, Response } from "express";
import { injectable } from "inversify";
import {AiService} from "../core/services";
import {controller, Get} from "../core/decorators";


@controller("/")
@injectable()
export class Users {
  private static users = [
    { id: 1, name: "John", age: 20, status: "active" },
    { id: 2, name: "Alex", age: 30, status: "inactive" },
    { id: 3, name: "Vera", age: 33, status: "inactive" },
  ];

  constructor(private readonly aiService: AiService) {}

  @Get("/users")
  getUserss(req: Request, res: Response): void {
    res.json(Users.users);
  }

  @Get("/yandex_df94c15d16270500.html")
  getUsers(req: Request, res: Response): void {
    res.send(`<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    </head>
    <body>Verification: df94c15d16270500</body>
</html>`);
  }

  @Get("/users/:id")
  getUserById(req: Request, res: Response): void {
    res.json(Users.users.find((user) => user.id.toString() === req.params.id));
  }

  @Get("/users/getUserByName/:name")
  async getUserByName(req: Request, res: Response): Promise<void> {
    //const res = this.aiService.request(req.body)
    console.log("query...");
    console.log(await this.aiService.request(req.params.name));
    res.json(Users.users.find((user) => user.name === req.params.name));
  }
}
