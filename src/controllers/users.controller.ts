import { Request, Response } from 'express';
import routes from '../decorators/routes.decorator';
import controller from '../decorators/controller.decorator';
import Get from '../decorators/get.decorator';

@controller('users')
export class Users  {

    private static users = [
        { id: 1, name: 'John', age: 20, status: 'active' },
        { id: 2, name: 'Alex', age: 30, status: 'inactive' },
        { id: 3, name: 'Vera', age: 33, status: 'inactive' }
    ];

    @Get('/')
    getUsers(req: Request, res: Response): void {
        res.json(Users.users);
    }

    @Get('/:id')
    getUserById(req: Request, res: Response): void {
        res.json(Users.users.find(user => user.id.toString() === req.params.id));
    }
    
    @Get('/getUserByName/:name')
    getUserByName(req: Request, res: Response): void {
        res.json(Users.users.find(user => user.name === req.params.name));
    }    

}
