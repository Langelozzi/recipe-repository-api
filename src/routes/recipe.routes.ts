import { RecipeController } from '../controllers/recipe.controller';
import { verifyToken } from '../helpers/auth/verifyToken';

export class RecipeRoutes {
    recipeController: RecipeController = new RecipeController();

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    constructor() {}

    public routes( app: any ): void {
        app.post( '/api/recipes/create', verifyToken, this.recipeController.create );

        app.get( '/api/recipes', verifyToken, this.recipeController.getCurrentUsersRecipes );

        app.get( '/api/recipes/favourites', verifyToken, this.recipeController.getFavouriteRecipes );

        app.get( '/api/recipes/:id', verifyToken, this.recipeController.getRecipeById );

        app.put( '/api/recipes/:id', verifyToken, this.recipeController.updateRecipeById );

        app.delete( '/api/recipes/:id', verifyToken, this.recipeController.deleteRecipeById );
    }
}