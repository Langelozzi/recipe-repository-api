import app from './app';
import { VercelRequest, VercelResponse } from '@vercel/node';
// eslint-disable-next-line @typescript-eslint/no-var-requires
// require( 'dotenv' ).config();

// const port = process.env.PORT || 3000;

// app.listen( port, () => {
//     console.log( `App started on port ${port}` );
// } );

export default (req: VercelRequest, res: VercelResponse) => {
    app(req as any, res as any);
}