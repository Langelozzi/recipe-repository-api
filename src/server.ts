import app from './app';
import log from './helpers/utils/logger';
// eslint-disable-next-line @typescript-eslint/no-var-requires
require( 'dotenv' ).config();

const port = process.env.PORT || 3000;

app.listen( port, () => {
    log.info( `App started on port ${port}` );
} );