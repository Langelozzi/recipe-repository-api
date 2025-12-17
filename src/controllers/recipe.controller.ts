import { RecipeModel } from '../models/recipe.model';
import { Request, Response } from 'express';
import { AuthController } from './auth.controller';
import { UserModel } from '../models/user.model';
import { imagekit } from '../helpers/utils/createImageKit';
import { logger } from '../helpers/utils/logger';
import mongoose from 'mongoose';


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
                    // With memory storage, file is already in buffer (image.buffer)
                    // No need to read from disk or clean up files

                    // uploading the image to the users imagekit folder
                    const uploadedImage = await imagekit.upload({
                        file: image.buffer,
                        fileName: `${req.body.name}`,
                        folder: `${userId}`
                    });

                    // saving the image urls to the recipe attribute
                    imageData.push(uploadedImage);
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
        try {
            const recipes = await RecipeModel.aggregate([
                {
                    $addFields: {
                        userIdObject: { $toObjectId: '$userId' }
                    }
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'userIdObject',
                        foreignField: '_id',
                        as: 'userDetails'
                    }
                },
                {
                    $unwind: {
                        path: '$userDetails',
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $addFields: {
                        user: {
                            userId: '$userIdObject' as any,
                            firstName: '$userDetails.firstName' as any,
                            lastName: '$userDetails.lastName' as any,
                            fullName: {
                                $concat: ['$userDetails.firstName', ' ', '$userDetails.lastName']
                            } as any
                        }
                    }
                },
                {
                    $sort: { createdAt: -1 }
                },
                {
                    $project: {
                        userDetails: 0,
                        userIdObject: 0
                    }
                }
            ] as any);

            res.status(200).json({
                ok: true,
                recipes: recipes
            });
        } catch (err: any) {
            logger(err.message, undefined, 'No recipes found');
            res.status(500).json({
                ok: false,
                message: err.message
            });
        }
    }

    public async getPublicRecipes(req: Request, res: Response) {
        try {
            const currentUser = await UserModel.findOne({ _id: req.user });

            // Base pipeline: only public recipes
            const pipeline: any[] = [
                { $match: { visibility: 1 } },
            ];

            // If we know the current user, exclude their recipes
            if (currentUser?._id) {
                pipeline[0].$match.userId = { $ne: currentUser._id.toString() };
            }

            pipeline.push(
                { $addFields: { userIdObject: { $toObjectId: '$userId' } } },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'userIdObject',
                        foreignField: '_id',
                        as: 'userDetails'
                    }
                },
                { $unwind: { path: '$userDetails', preserveNullAndEmptyArrays: true } },
                {
                    $addFields: {
                        user: {
                            userId: '$userIdObject' as any,
                            firstName: '$userDetails.firstName' as any,
                            lastName: '$userDetails.lastName' as any,
                            fullName: { $concat: ['$userDetails.firstName', ' ', '$userDetails.lastName'] } as any
                        }
                    }
                },
                { $sort: { createdAt: -1 } },
                { $project: { userDetails: 0, userIdObject: 0 } }
            );

            const recipes = await RecipeModel.aggregate(pipeline as any);

            res.status(200).json({ ok: true, recipes });
        } catch (err: any) {
            logger(err.message, undefined, 'No public recipes found');
            res.status(500).json({ ok: false, message: err.message });
        }
    }

    public async getCurrentUsersRecipes(req: Request, res: Response) {
        try {
            const currentUser = await UserModel.findOne({ _id: req.user });

            const recipes = await RecipeModel.aggregate([
                {
                    $match: {
                        userId: currentUser?._id?.toString()
                    }
                },
                {
                    $addFields: {
                        userIdObject: { $toObjectId: '$userId' }
                    }
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'userIdObject',
                        foreignField: '_id',
                        as: 'userDetails'
                    }
                },
                {
                    $unwind: {
                        path: '$userDetails',
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $addFields: {
                        user: {
                            userId: '$userIdObject' as any,
                            firstName: '$userDetails.firstName' as any,
                            lastName: '$userDetails.lastName' as any,
                            fullName: {
                                $concat: ['$userDetails.firstName', ' ', '$userDetails.lastName']
                            } as any
                        }
                    }
                },
                { $sort: { createdAt: -1 } },
                {
                    $project: {
                        userDetails: 0,
                        userIdObject: 0
                    }
                }
            ] as any);

            res.status(200).json({
                ok: true,
                recipes: recipes
            });
        } catch (err: any) {
            logger(err.message, undefined, 'Failed to fetch user recipes');
            res.status(500).json({
                ok: false,
                message: err.message
            });
        }
    }

    public async getRecipeById(req: Request, res: Response) {
        try {
            const recipes = await RecipeModel.aggregate([
                {
                    $match: {
                        _id: new mongoose.Types.ObjectId(req.params.id)
                    }
                },
                {
                    $addFields: {
                        userIdObject: { $toObjectId: '$userId' }
                    }
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'userIdObject',
                        foreignField: '_id',
                        as: 'userDetails'
                    }
                },
                {
                    $unwind: {
                        path: '$userDetails',
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $addFields: {
                        user: {
                            userId: '$userIdObject' as any,
                            firstName: '$userDetails.firstName' as any,
                            lastName: '$userDetails.lastName' as any,
                            fullName: {
                                $concat: ['$userDetails.firstName', ' ', '$userDetails.lastName']
                            } as any
                        }
                    }
                },
                {
                    $project: {
                        userDetails: 0,
                        userIdObject: 0
                    }
                }
            ] as any);

            res.status(200).json({
                ok: true,
                recipe: recipes[0]
            });
        } catch (err: any) {
            logger(err.message, undefined, `No recipe with id ${req.params.id}`);
            res.status(500).json({
                ok: false,
                message: err.message
            });
        }
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
        try {
            const currentUser = await UserModel.findOne({ _id: req.user });

            const recipes = await RecipeModel.aggregate([
                {
                    $match: {
                        userId: currentUser?._id?.toString(),
                        favourite: true
                    }
                },
                {
                    $addFields: {
                        userIdObject: { $toObjectId: '$userId' }
                    }
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'userIdObject',
                        foreignField: '_id',
                        as: 'userDetails'
                    }
                },
                {
                    $unwind: {
                        path: '$userDetails',
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $addFields: {
                        user: {
                            userId: '$userIdObject' as any,
                            firstName: '$userDetails.firstName' as any,
                            lastName: '$userDetails.lastName' as any,
                            fullName: {
                                $concat: ['$userDetails.firstName', ' ', '$userDetails.lastName']
                            } as any
                        }
                    }
                },
                { $sort: { createdAt: -1 } },
                {
                    $project: {
                        userDetails: 0,
                        userIdObject: 0
                    }
                }
            ] as any);

            res.status(200).json({
                ok: true,
                recipes: recipes
            });
        } catch (err: any) {
            logger(err.message, undefined, 'Failed to find favourite recipes');
            res.status(500).json({
                ok: false,
                message: err.message
            });
        }
    }

    public async postDuplicateRecipeById(req: Request, res: Response) {
        const currentUser = await UserModel.findOne({ _id: req.user });

        const recipe = await RecipeModel.findById(req.params.id);
        const recipeObject = recipe?.toObject();

        const newRecipe = new RecipeModel({
            userId: currentUser?._id?.toString(),
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