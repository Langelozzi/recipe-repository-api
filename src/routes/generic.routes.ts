import { Request, Response } from "express";

export class GenericRoutes {
    constructor() { }

    public routes(app: any): void {
        app.get('/', (req: Request, res: Response) => { res.status(200).json({ message: "Hello world" }) });
    }
}