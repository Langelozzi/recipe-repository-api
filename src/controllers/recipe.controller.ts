import { RecipeModel } from '../models/recipe.model';
import { Request, Response } from 'express';
import { AuthController } from './auth.controller';
import { UserModel } from '../models/user.model';

export class RecipeController {
    authController: AuthController = new AuthController();

    public async create( req: Request, res: Response ) {
        const imagePaths: string[] = [];
        
        if ( req.files ) {
            const images: any = req.files;
            
            for ( const image of images ) {
                imagePaths.push( image.path );
            }
        }

        // getting recipe information from request body
        const { name, ingredients, steps, favourite, prepTime, cookTime, ovenTemp, notes, cuisine, facts, tags, description } = req.body;
        
        // getting current user id from database using request user which is set when verifyToken is ran
        const currentUser = await UserModel.findOne( { _id: req.user } );
        const userId = currentUser?._id;

        // create new recipe
        const newRecipe = new RecipeModel( {
            userId,
            name,
            ingredients,
            steps,
            favourite,
            prepTime,
            cookTime,
            ovenTemp,
            notes,
            cuisine,
            facts,
            tags,
            description,
            imagePaths
        } );

        // save recipe and return it if no errors
        try {
            const savedRecipe = await newRecipe.save();

            res.status( 201 ).json( {
                ok: true,
                message: 'New recipe created',
                recipe: savedRecipe
            } );
        } catch ( e: any ) {
            res.status( 500 ).json( {
                ok: false,
                message: e.message
            } );
        }
    }

    public async getCurrentUsersRecipes( req: Request, res: Response ) {
        const currentUser = await UserModel.findOne( { _id: req.user } );

        RecipeModel.find( { userId: currentUser?._id }, ( err: any, data: any ) => {
            if ( err ) {
                res.send( err );
            }
            
            res.status( 200 ).json( {
                ok: true,
                recipes: data
            } );
        } );

    }

    public async getRecipeById( req: Request, res: Response ) {
        RecipeModel.findById( req.params.id, ( err: any, data: any ) => {
            if ( err ) {
                res.send( err );
            }

            res.status( 200 ).json( {
                ok: true,
                recipe: data
            } );
        } );
    }

    public async updateRecipeById( req: Request, res: Response ) {
        RecipeModel.findOneAndUpdate( { _id: req.body._id }, req.body, { new: true }, ( err: any, data: any ) => {
            if ( err ) {
                res.send( err );
            } 

            res.status( 200 ).json( {
                ok: true,
                updatedRecipe: data
            } );
        } );
    }

    public async deleteRecipeById( req: Request, res: Response ) {
        RecipeModel.findOneAndDelete( { _id: req.params.id }, ( err: any ) => {
            if ( err ) {
                res.send( err );
            } 

            res.status( 200 ).json( {
                ok: true
            } );
        } );
    }

    public async getFavouriteRecipes( req: Request, res: Response ) {
        const currentUser = await UserModel.findOne( { _id: req.user } );

        RecipeModel.find( { userId: currentUser?._id, favourite: true }, ( err: any, data: any ) => {
            if ( err ) {
                res.send( err );
            }
            
            res.status( 200 ).json( {
                ok: true,
                recipes: data
            } );
        } );
    }
}