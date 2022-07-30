import * as bcrypt from 'bcryptjs';
import { Request, Response } from 'express';

import { generateAccessToken } from '../helpers/auth/generateAccessToken';
import { loginValidation, registerValidation } from '../helpers/utils/validation';
import { UserModel } from '../models/user.model';
import * as jwt from 'jsonwebtoken';

export class AuthController {

    public async registerUser( req: Request, res: Response ) {
        // Validate the data before we create the user
        const { error } = registerValidation( req.body );
        if ( error ) {
            return res.status( 400 ).send( error?.details[0].message );
        }

        // Checking if the user already exists
        const emailExist = await UserModel.findOne( { email: req.body.email } );
        if ( emailExist ) {
            return res.status( 400 ).send( 'Email already exists' );
        }

        // Hash the password
        const salt = await bcrypt.genSalt( 10 );
        const hashedPassword = await bcrypt.hash( req.body.password, salt );
        
        // Create new user
        const user = new UserModel( {
            email: req.body.email,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            password: hashedPassword
        } );

        // Save them if no errors occur
        try {
            const savedUser = await user.save();
            res.send( savedUser );
        } catch( err ) {
            res.status( 400 ).send( err );
        }
    }

    public async loginUser( req: Request, res: Response ) {
        // Validate the data before we create the user
        const { error } = loginValidation( req.body );
        if ( error ) {
            return res.status( 400 ).send( error?.details[0].message );
        }

        const user = await UserModel.findOne( { email: req.body.email } );
        // Checking if a user exists with that email
        if ( !user ) {
            return res.status( 400 ).send( 'No account registered with that email' );
        }

        // Checking if the password is correct
        const validPass = await bcrypt.compare( req.body.password, user.password );
        if ( !validPass ) {
            return res.status( 400 ).send( 'Incorrect Password' );
        }

        // Create an access token for the user
        const accessToken = generateAccessToken( user );

        res.json( {
            accessToken: accessToken,
        } );
    }

    public async getCurrentUser( req: Request, res: Response ) {
        const currentUser = await UserModel.findOne( { _id: req.user } );

        res.json( currentUser );
    }

    public async verifyToken( req: Request, res: Response ) {
        const token = req.header( 'Access-Token' );

        if ( !token ) {
            return res.status( 401 ).send( 'Access Denied' );
        }

        try {
            const verified = jwt.verify( token, <jwt.Secret>process.env.ACCESS_TOKEN_SECRET );
            req.user = <any>verified;

            res.status( 200 ).json({
                ok: true,
                valid: true
            })
        } catch( err ) {
            res.status( 401 ).send( 'Invalid Token' ).json({
                ok: false,
                valid: false
            });
        }
    }
}