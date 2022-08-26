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
    public router: express.Router;
    public indexRoutes: IndexRoutes = new IndexRoutes();
    public authRoutes: AuthRoutes = new AuthRoutes();
    public recipeRoutes: RecipeRoutes = new RecipeRoutes();
    
    constructor() {
        this.app = express();
        this.router = express.Router();

        this.config();
        connectToDb();
    }

    private config(): void {
        this.app.use( bodyParser.json() );
        this.app.use( ( req, res, next ) => { next(); }, cors( {} ) );

        this.indexRoutes.routes( this.router );
        this.authRoutes.routes( this.router );
        this.recipeRoutes.routes( this.router );

        this.router.get( '/test', ( req, res ) => { res.json( { 'test': 'successful' } );} );
        
        this.app.use( '/.netlify/functions/api', this.router );
    }
}

export default new App().app;