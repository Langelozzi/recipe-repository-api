import bodyParser from 'body-parser';
import express from 'express';
import cors from 'cors';

import { AuthRoutes } from './routes/auth.routes';
import connectToDb from './helpers/utils/connectToDb';
import { RecipeRoutes } from './routes/recipe.routes';
import { GenericRoutes } from './routes/generic.routes';

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();
class App {
    public app: express.Application;
    public genericRoutes: GenericRoutes = new GenericRoutes();
    public authRoutes: AuthRoutes = new AuthRoutes();
    public recipeRoutes: RecipeRoutes = new RecipeRoutes();

    constructor() {
        this.app = express();
        this.config();
        connectToDb();
        this.genericRoutes.routes(this.app);
        this.authRoutes.routes(this.app);
        this.recipeRoutes.routes(this.app);
    }

    private config(): void {
        this.app.use(bodyParser.json());
        this.app.use(cors({
            origin: [
                'http://localhost:4200',
                'https://recipe-repository-app.vercel.app'
            ],
            credentials: true,
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
            allowedHeaders: ['Content-Type', 'Authorization']
        }));
    }
}

export default new App().app;