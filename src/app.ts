import bodyParser from 'body-parser';
import express from 'express';
import cors from 'cors';

import { AuthRoutes } from './routes/auth.routes';
import connectToDb from './helpers/utils/connectToDb';
import { RecipeRoutes } from './routes/recipe.routes';
import { IndexRoutes } from './routes/index.routes';

// eslint-disable-next-line @typescript-eslint/no-var-requires
require( 'dotenv' ).config();
class App {
    public app: express.Application;
    public indexRoutes: IndexRoutes = new IndexRoutes();
    public authRoutes: AuthRoutes = new AuthRoutes();
    public recipeRoutes: RecipeRoutes = new RecipeRoutes();
    
    constructor() {
        this.app = express();
        this.config();
        connectToDb();
        this.indexRoutes.routes( this.app );
        this.authRoutes.routes( this.app );
        this.recipeRoutes.routes( this.app );
    }

    private config(): void {
        this.app.use( bodyParser.json() );
        this.app.use( ( req, res, next ) => { next(); }, cors( {} ) );
    }
}

export default new App().app;