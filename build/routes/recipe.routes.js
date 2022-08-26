"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecipeRoutes = void 0;
const recipe_controller_1 = require("../controllers/recipe.controller");
const verifyToken_1 = require("../helpers/auth/verifyToken");
const createUpload_1 = require("../uploads/createUpload");
class RecipeRoutes {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    constructor() {
        this.recipeController = new recipe_controller_1.RecipeController();
    }
    routes(router) {
        router.post('/recipes/create', verifyToken_1.verifyToken, createUpload_1.upload.array('files'), this.recipeController.create);
        router.get('/recipes', verifyToken_1.verifyToken, this.recipeController.getCurrentUsersRecipes);
        router.get('/recipes/favourites', verifyToken_1.verifyToken, this.recipeController.getFavouriteRecipes);
        router.get('/recipes/:id', verifyToken_1.verifyToken, this.recipeController.getRecipeById);
        router.put('/recipes/:id', verifyToken_1.verifyToken, this.recipeController.updateRecipeById);
        router.delete('/recipes/:id', verifyToken_1.verifyToken, this.recipeController.deleteRecipeById);
    }
}
exports.RecipeRoutes = RecipeRoutes;
