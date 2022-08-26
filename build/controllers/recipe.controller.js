"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecipeController = void 0;
const recipe_model_1 = require("../models/recipe.model");
const auth_controller_1 = require("./auth.controller");
const user_model_1 = require("../models/user.model");
class RecipeController {
    constructor() {
        this.authController = new auth_controller_1.AuthController();
    }
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // getting recipe information from request body
            const { name, ingredients, steps, favourite, prepTime, cookTime, ovenTemp, notes, cuisine, facts, tags, description } = req.body;
            // getting current user id from database using request user which is set when verifyToken is ran
            const currentUser = yield user_model_1.UserModel.findOne({ _id: req.user });
            const userId = currentUser === null || currentUser === void 0 ? void 0 : currentUser._id;
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
                description
            });
            // save recipe and return it if no errors
            try {
                const savedRecipe = yield newRecipe.save();
                res.status(201).json({
                    ok: true,
                    message: 'New recipe created',
                    recipe: savedRecipe
                });
            }
            catch (e) {
                res.status(500).json({
                    ok: false,
                    message: e.message
                });
            }
        });
    }
    getCurrentUsersRecipes(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentUser = yield user_model_1.UserModel.findOne({ _id: req.user });
            recipe_model_1.RecipeModel.find({ userId: currentUser === null || currentUser === void 0 ? void 0 : currentUser._id }, (err, data) => {
                if (err) {
                    res.send(err);
                }
                res.status(200).json({
                    ok: true,
                    recipes: data
                });
            });
        });
    }
    getRecipeById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            recipe_model_1.RecipeModel.findById(req.params.id, (err, data) => {
                if (err) {
                    res.send(err);
                }
                res.status(200).json({
                    ok: true,
                    recipe: data
                });
            });
        });
    }
    updateRecipeById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            recipe_model_1.RecipeModel.findOneAndUpdate({ _id: req.body._id }, req.body, { new: true }, (err, data) => {
                if (err) {
                    res.send(err);
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
            recipe_model_1.RecipeModel.findOneAndDelete({ _id: req.params.id }, (err) => {
                if (err) {
                    res.send(err);
                }
                res.status(200).json({
                    ok: true
                });
            });
        });
    }
    getFavouriteRecipes(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentUser = yield user_model_1.UserModel.findOne({ _id: req.user });
            recipe_model_1.RecipeModel.find({ userId: currentUser === null || currentUser === void 0 ? void 0 : currentUser._id, favourite: true }, (err, data) => {
                if (err) {
                    res.send(err);
                }
                res.status(200).json({
                    ok: true,
                    recipes: data
                });
            });
        });
    }
}
exports.RecipeController = RecipeController;
