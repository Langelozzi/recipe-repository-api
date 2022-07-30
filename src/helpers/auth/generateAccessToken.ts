import * as jwt from 'jsonwebtoken';

export function generateAccessToken( user: any ) {
    return jwt.sign( { _id: user._id }, <jwt.Secret>process.env.ACCESS_TOKEN_SECRET, { expiresIn: '12h' } );
}