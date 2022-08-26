import app from './app';
// eslint-disable-next-line @typescript-eslint/no-var-requires
require( 'dotenv' ).config();

const port = process.env.PORT || 3000;

app.listen( port, () => {
    console.log( `App started on port ${port}` );
} );