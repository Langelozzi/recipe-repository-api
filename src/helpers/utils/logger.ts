import { LogModel } from '../../models/log.model';

export async function logger( message: string, code?: number, plainTextMessage?: string ): Promise<void> {
    const newLogEntry = new LogModel( {
        message: message,
        code: code,
        plainTextMessage: plainTextMessage
    } );

    try {
        const savedLog = await newLogEntry.save();
    } catch ( e ) {
        console.log( 'Log entry failed to save' );
    }
}