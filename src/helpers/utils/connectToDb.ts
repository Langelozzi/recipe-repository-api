import mongoose from 'mongoose';

async function connectToDb() {
    const dbUri = <string>process.env.DB_URI;

    try {
        await mongoose.connect( dbUri );
        console.log( 'Connected to DB' );
    } catch ( e ) {
        process.exit( 1 );
    }
}

export default connectToDb;