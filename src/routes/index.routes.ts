// import express from 'express';

// const router = express.Router();

// router.get( '/', ( req, res ) => { res.json( { 'ok': true } ); } );

// router.get( '/healthcheck', ( req, res ) => { res.sendStatus( 200 ); } );

// export default router;

export class IndexRoutes {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    constructor() {}

    public routes( app: any ): void {
        app.get( '/', ( req: any, res: any ) => { res.json( { 'ok': true } ); } );
    }
}