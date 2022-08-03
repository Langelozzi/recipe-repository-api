import { RecipeController } from '../controllers/recipe.controller';
import { verifyToken } from '../helpers/auth/verifyToken';
import { upload } from '../uploads/createUpload';

export class RecipeRoutes {
    recipeController: RecipeController = new RecipeController();

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    constructor() {}

    public routes( app: any ): void {
        app.post( '/api/recipes/create', verifyToken, upload.array( 'files' ), this.recipeController.create );

        app.get( '/api/recipes', verifyToken, this.recipeController.getCurrentUsersRecipes );

        app.get( '/api/recipes/favourites', verifyToken, this.recipeController.getFavouriteRecipes );

        app.get( '/api/recipes/:id', verifyToken, this.recipeController.getRecipeById );

        app.put( '/api/recipes/:id', verifyToken, this.recipeController.updateRecipeById );

        app.delete( '/api/recipes/:id', verifyToken, this.recipeController.deleteRecipeById );
    }
}