import * as jwt from 'jsonwebtoken';
import { Request, Response } from 'express';

export function verifyToken( req: Request, res: Response, next: any ) {
    const token = req.header( 'Access-Token' );
    if ( !token ) {
        return res.status( 401 ).send( 'Access Denied' );
    }

    try {
        const verified = jwt.verify( token, <jwt.Secret>process.env.ACCESS_TOKEN_SECRET );
        req.user = <any>verified;

        // this means that it allows it to go to the next item, which would be our api endpoint
        next();
    } catch( err ) {
        res.status( 401 ).send( 'Invalid Token' );
    }
}