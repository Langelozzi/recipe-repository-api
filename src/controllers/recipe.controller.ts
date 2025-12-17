import { RecipeModel } from '../models/recipe.model';
import { Request, Response } from 'express';
import { AuthController } from './auth.controller';
import { UserModel } from '../models/user.model';
import { readFile } from 'fs/promises';
import { imagekit } from '../helpers/utils/createImageKit';
import * as fs from 'fs';
import { logger } from '../helpers/utils/logger';


export class RecipeController {
    authController: AuthController = new AuthController();

    public async create(req: Request, res: Response) {
        const imageData: object[] = [];
        // getting current user id from database using request user which is set when verifyToken is ran
        const currentUser = await UserModel.findOne({ _id: req.user });
        const userId = currentUser?._id;

        try {
            if (req.files) {
                const images: any = req.files;

                // creates the users folder if it doesn't already exist
                // imagekit simply doesn't create a new one if it already exists
                const newFolder = await imagekit.createFolder({
                    folderName: `${userId}`,
                    parentFolderPath: '/'
                });

                for (const image of images) {
                    // reading the file that was saved to the server file system
                    const file = await readFile(image.path);

                    // uploading the image to the users imagekit folder
                    const uploadedImage = await imagekit.upload({
                        file: file,
                        fileName: `${req.body.name}`,
                        folder: `${userId}`
                    });

                    // saving the image urls to the recipe attribute
                    imageData.push(uploadedImage);

                    // removing the file from the server file system once it is uploaded
                    if (fs.existsSync(image.path)) {
                        fs.unlinkSync(image.path);
                    }

                }
            }

            // getting recipe information from request body
            const { name, ingredients, steps, favourite, prepTime, cookTime, ovenTemp, notes, cuisine, facts, tags, description, visibility } = req.body;


            // create new recipe
            const newRecipe = new RecipeModel({
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
                imageData,
                visibility
            });

            // save recipe and return it if no errors
            const savedRecipe = await newRecipe.save();

            res.status(201).json({
                ok: true,
                message: 'New recipe created',
                recipe: savedRecipe
            });
        } catch (e: any) {
            logger(e.message, 404, 'Recipe creation failed');

            res.status(404).json({
                ok: false,
                message: e.message
            });
        }
    }

    public async getAllRecipes(req: Request, res: Response) {
        RecipeModel.find({}, (err: any, data: any) => {
            if (err) {
                logger(err.message, undefined, 'No recipes found');
                res.send(err);
            }

            res.status(200).json({
                ok: true,
                recipes: data
            });
        });
    }

    public async getPublicRecipes(req: Request, res: Response) {
        const currentUser = await UserModel.findOne({ _id: req.user });

        RecipeModel.find({ visibility: 1, userId: { $ne: currentUser?._id } }, (err: any, data: any) => {
            if (err) {
                logger(err.message, undefined, 'No public recipes found');
                res.send(err);
            }

            res.status(200).json({
                ok: true,
                recipes: data
            });
        });
    }

    public async getCurrentUsersRecipes(req: Request, res: Response) {
        const currentUser = await UserModel.findOne({ _id: req.user });

        RecipeModel.find({ userId: currentUser?._id }, (err: any, data: any) => {
            if (err) {
                logger(err.message, undefined, `No user with id ${currentUser?._id}`);
                res.send(err);
            }

            res.status(200).json({
                ok: true,
                recipes: data
            });
        });

    }

    public async getRecipeById(req: Request, res: Response) {
        RecipeModel.findById(req.params.id, (err: any, data: any) => {
            if (err) {
                logger(err.message, undefined, `No recipe with id ${req.params.id}`);
                res.send(err);
            }

            res.status(200).json({
                ok: true,
                recipe: data
            });
        });
    }

    public async updateRecipeById(req: Request, res: Response) {
        RecipeModel.findOneAndUpdate({ _id: req.body._id }, req.body, { new: true }, (err: any, data: any) => {
            if (err) {
                res.send(err);
                logger(err.message, undefined, 'Recipe update failed');
            }

            res.status(200).json({
                ok: true,
                updatedRecipe: data
            });
        });
    }

    public async deleteRecipeById(req: Request, res: Response) {
        const currentUser = await UserModel.findOne({ _id: req.user });
        const allImagePaths: string[] = [];

        RecipeModel.find({ userId: currentUser?._id }, (err: any, recipes: any) => {
            if (err) {
                logger(err.message, undefined, `No user with id ${currentUser?._id}`);
            } else {
                for (const recipe of recipes) {
                    // only add image paths of recipes that are not the one being deleted
                    if (recipe._id != req.params.id && recipe.imagePaths && recipe.imagePaths.length > 0) {
                        for (const path of recipe.imagePaths) {
                            allImagePaths.push(path);
                        }
                    }

                }
            }

        });

        RecipeModel.findById(req.params.id, (err: any, data: any) => {
            if (err) {
                logger(err.message, undefined, `No recipe with id ${req.params.id}`);
            } else {
                // if there are image paths then delete the photo if the photo exists on the server
                try {
                    for (const image of data.imageData) {
                        imagekit.deleteFile(image.fileId);
                    }
                } catch (e: any) {
                    logger(e.message, undefined, 'No property "imageData" on recipe');
                }
            }

        });

        RecipeModel.findOneAndDelete({ _id: req.params.id }, (err: any) => {
            if (err) {
                logger(err.message, undefined, 'Recipe deletion failed');
                res.send(err);
            } else {
                res.status(200).json({
                    ok: true
                });
            }
        });
    }

    public async getFavouriteRecipes(req: Request, res: Response) {
        const currentUser = await UserModel.findOne({ _id: req.user });

        RecipeModel.find({ userId: currentUser?._id, favourite: true }, (err: any, data: any) => {
            if (err) {
                logger(err.message, undefined, 'Failed to find favourite recipes');
                res.send(err);
            }

            res.status(200).json({
                ok: true,
                recipes: data
            });
        });
    }

    public async postDuplicateRecipeById(req: Request, res: Response) {
        const recipe = await RecipeModel.findById(req.params.id);
        const recipeObject = recipe?.toObject();

        // write me some logic to duplicate the recipe
        const newRecipe = new RecipeModel({
            userId: recipeObject?.userId,
            name: `${recipeObject?.name} - Copy`,
            ingredients: recipeObject?.ingredients,
            steps: recipeObject?.steps,
            favourite: false,
            prepTime: recipeObject?.prepTime,
            cookTime: recipeObject?.cookTime,
            ovenTemp: recipeObject?.ovenTemp,
            notes: recipeObject?.notes,
            cuisine: recipeObject?.cuisine,
            facts: recipeObject?.facts,
            tags: recipeObject?.tags,
            description: recipeObject?.description,
            imageData: recipeObject?.imageData,
            visibility: recipeObject?.visibility
        });

        const savedRecipe = await newRecipe.save();

        res.status(201).json({
            ok: true,
            message: 'Recipe duplicated successfully',
            recipe: savedRecipe
        });
    }
}