"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecipeController = void 0;
const recipe_model_1 = require("../models/recipe.model");
const auth_controller_1 = require("./auth.controller");
const user_model_1 = require("../models/user.model");
const promises_1 = require("fs/promises");
const createImageKit_1 = require("../helpers/utils/createImageKit");
const fs = __importStar(require("fs"));
const logger_1 = require("../helpers/utils/logger");
const mongoose_1 = __importDefault(require("mongoose"));
class RecipeController {
    constructor() {
        this.authController = new auth_controller_1.AuthController();
    }
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const imageData = [];
            // getting current user id from database using request user which is set when verifyToken is ran
            const currentUser = yield user_model_1.UserModel.findOne({ _id: req.user });
            const userId = currentUser === null || currentUser === void 0 ? void 0 : currentUser._id;
            try {
                if (req.files) {
                    const images = req.files;
                    // creates the users folder if it doesn't already exist
                    // imagekit simply doesn't create a new one if it already exists
                    const newFolder = yield createImageKit_1.imagekit.createFolder({
                        folderName: `${userId}`,
                        parentFolderPath: '/'
                    });
                    for (const image of images) {
                        // reading the file that was saved to the server file system
                        const file = yield (0, promises_1.readFile)(image.path);
                        // uploading the image to the users imagekit folder
                        const uploadedImage = yield createImageKit_1.imagekit.upload({
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
                const newRecipe = new recipe_model_1.RecipeModel({
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
                const savedRecipe = yield newRecipe.save();
                res.status(201).json({
                    ok: true,
                    message: 'New recipe created',
                    recipe: savedRecipe
                });
            }
            catch (e) {
                (0, logger_1.logger)(e.message, 404, 'Recipe creation failed');
                res.status(404).json({
                    ok: false,
                    message: e.message
                });
            }
        });
    }
    getAllRecipes(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const recipes = yield recipe_model_1.RecipeModel.aggregate([
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
                                firstName: '$userDetails.firstName',
                                lastName: '$userDetails.lastName',
                                fullName: {
                                    $concat: ['$userDetails.firstName', ' ', '$userDetails.lastName']
                                }
                            }
                        }
                    },
                    {
                        $project: {
                            userDetails: 0,
                            userIdObject: 0
                        }
                    }
                ]);
                res.status(200).json({
                    ok: true,
                    recipes: recipes
                });
            }
            catch (err) {
                (0, logger_1.logger)(err.message, undefined, 'No recipes found');
                res.status(500).json({
                    ok: false,
                    message: err.message
                });
            }
        });
    }
    getPublicRecipes(req, res) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const currentUser = yield user_model_1.UserModel.findOne({ _id: req.user });
                const recipes = yield recipe_model_1.RecipeModel.aggregate([
                    {
                        $match: {
                            visibility: 1,
                            userId: { $ne: (_a = currentUser === null || currentUser === void 0 ? void 0 : currentUser._id) === null || _a === void 0 ? void 0 : _a.toString() }
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
                                firstName: '$userDetails.firstName',
                                lastName: '$userDetails.lastName',
                                fullName: {
                                    $concat: ['$userDetails.firstName', ' ', '$userDetails.lastName']
                                }
                            }
                        }
                    },
                    {
                        $project: {
                            userDetails: 0,
                            userIdObject: 0
                        }
                    }
                ]);
                res.status(200).json({
                    ok: true,
                    recipes: recipes
                });
            }
            catch (err) {
                (0, logger_1.logger)(err.message, undefined, 'No public recipes found');
                res.status(500).json({
                    ok: false,
                    message: err.message
                });
            }
        });
    }
    getCurrentUsersRecipes(req, res) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const currentUser = yield user_model_1.UserModel.findOne({ _id: req.user });
                const recipes = yield recipe_model_1.RecipeModel.aggregate([
                    {
                        $match: {
                            userId: (_a = currentUser === null || currentUser === void 0 ? void 0 : currentUser._id) === null || _a === void 0 ? void 0 : _a.toString()
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
                                firstName: '$userDetails.firstName',
                                lastName: '$userDetails.lastName',
                                fullName: {
                                    $concat: ['$userDetails.firstName', ' ', '$userDetails.lastName']
                                }
                            }
                        }
                    },
                    {
                        $project: {
                            userDetails: 0,
                            userIdObject: 0
                        }
                    }
                ]);
                res.status(200).json({
                    ok: true,
                    recipes: recipes
                });
            }
            catch (err) {
                (0, logger_1.logger)(err.message, undefined, 'Failed to fetch user recipes');
                res.status(500).json({
                    ok: false,
                    message: err.message
                });
            }
        });
    }
    getRecipeById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const recipes = yield recipe_model_1.RecipeModel.aggregate([
                    {
                        $match: {
                            _id: new mongoose_1.default.Types.ObjectId(req.params.id)
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
                                firstName: '$userDetails.firstName',
                                lastName: '$userDetails.lastName',
                                fullName: {
                                    $concat: ['$userDetails.firstName', ' ', '$userDetails.lastName']
                                }
                            }
                        }
                    },
                    {
                        $project: {
                            userDetails: 0,
                            userIdObject: 0
                        }
                    }
                ]);
                res.status(200).json({
                    ok: true,
                    recipe: recipes[0]
                });
            }
            catch (err) {
                (0, logger_1.logger)(err.message, undefined, `No recipe with id ${req.params.id}`);
                res.status(500).json({
                    ok: false,
                    message: err.message
                });
            }
        });
    }
    updateRecipeById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            recipe_model_1.RecipeModel.findOneAndUpdate({ _id: req.body._id }, req.body, { new: true }, (err, data) => {
                if (err) {
                    res.send(err);
                    (0, logger_1.logger)(err.message, undefined, 'Recipe update failed');
                }
                res.status(200).json({
                    ok: true,
                    updatedRecipe: data
                });
            });
        });
    }
    deleteRecipeById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentUser = yield user_model_1.UserModel.findOne({ _id: req.user });
            const allImagePaths = [];
            recipe_model_1.RecipeModel.find({ userId: currentUser === null || currentUser === void 0 ? void 0 : currentUser._id }, (err, recipes) => {
                if (err) {
                    (0, logger_1.logger)(err.message, undefined, `No user with id ${currentUser === null || currentUser === void 0 ? void 0 : currentUser._id}`);
                }
                else {
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
            recipe_model_1.RecipeModel.findById(req.params.id, (err, data) => {
                if (err) {
                    (0, logger_1.logger)(err.message, undefined, `No recipe with id ${req.params.id}`);
                }
                else {
                    // if there are image paths then delete the photo if the photo exists on the server
                    try {
                        for (const image of data.imageData) {
                            createImageKit_1.imagekit.deleteFile(image.fileId);
                        }
                    }
                    catch (e) {
                        (0, logger_1.logger)(e.message, undefined, 'No property "imageData" on recipe');
                    }
                }
            });
            recipe_model_1.RecipeModel.findOneAndDelete({ _id: req.params.id }, (err) => {
                if (err) {
                    (0, logger_1.logger)(err.message, undefined, 'Recipe deletion failed');
                    res.send(err);
                }
                else {
                    res.status(200).json({
                        ok: true
                    });
                }
            });
        });
    }
    getFavouriteRecipes(req, res) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const currentUser = yield user_model_1.UserModel.findOne({ _id: req.user });
                const recipes = yield recipe_model_1.RecipeModel.aggregate([
                    {
                        $match: {
                            userId: (_a = currentUser === null || currentUser === void 0 ? void 0 : currentUser._id) === null || _a === void 0 ? void 0 : _a.toString(),
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
                                firstName: '$userDetails.firstName',
                                lastName: '$userDetails.lastName',
                                fullName: {
                                    $concat: ['$userDetails.firstName', ' ', '$userDetails.lastName']
                                }
                            }
                        }
                    },
                    {
                        $project: {
                            userDetails: 0,
                            userIdObject: 0
                        }
                    }
                ]);
                res.status(200).json({
                    ok: true,
                    recipes: recipes
                });
            }
            catch (err) {
                (0, logger_1.logger)(err.message, undefined, 'Failed to find favourite recipes');
                res.status(500).json({
                    ok: false,
                    message: err.message
                });
            }
        });
    }
    postDuplicateRecipeById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const recipe = yield recipe_model_1.RecipeModel.findById(req.params.id);
            const recipeObject = recipe === null || recipe === void 0 ? void 0 : recipe.toObject();
            // write me some logic to duplicate the recipe
            const newRecipe = new recipe_model_1.RecipeModel({
                userId: recipeObject === null || recipeObject === void 0 ? void 0 : recipeObject.userId,
                name: `${recipeObject === null || recipeObject === void 0 ? void 0 : recipeObject.name} - Copy`,
                ingredients: recipeObject === null || recipeObject === void 0 ? void 0 : recipeObject.ingredients,
                steps: recipeObject === null || recipeObject === void 0 ? void 0 : recipeObject.steps,
                favourite: false,
                prepTime: recipeObject === null || recipeObject === void 0 ? void 0 : recipeObject.prepTime,
                cookTime: recipeObject === null || recipeObject === void 0 ? void 0 : recipeObject.cookTime,
                ovenTemp: recipeObject === null || recipeObject === void 0 ? void 0 : recipeObject.ovenTemp,
                notes: recipeObject === null || recipeObject === void 0 ? void 0 : recipeObject.notes,
                cuisine: recipeObject === null || recipeObject === void 0 ? void 0 : recipeObject.cuisine,
                facts: recipeObject === null || recipeObject === void 0 ? void 0 : recipeObject.facts,
                tags: recipeObject === null || recipeObject === void 0 ? void 0 : recipeObject.tags,
                description: recipeObject === null || recipeObject === void 0 ? void 0 : recipeObject.description,
                imageData: recipeObject === null || recipeObject === void 0 ? void 0 : recipeObject.imageData,
                visibility: recipeObject === null || recipeObject === void 0 ? void 0 : recipeObject.visibility
            });
            const savedRecipe = yield newRecipe.save();
            res.status(201).json({
                ok: true,
                message: 'Recipe duplicated successfully',
                recipe: savedRecipe
            });
        });
    }
}
exports.RecipeController = RecipeController;
