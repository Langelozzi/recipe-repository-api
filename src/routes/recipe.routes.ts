import { RecipeController } from '../controllers/recipe.controller';
import { verifyToken } from '../helpers/auth/verifyToken';
import { upload } from '../uploads/createUpload';

export class RecipeRoutes {
    recipeController: RecipeController = new RecipeController();

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    constructor() {}

    public routes( router: any ): void {
        router.post( '/recipes/create', verifyToken, upload.array( 'files' ), this.recipeController.create );

        router.get( '/recipes', verifyToken, this.recipeController.getCurrentUsersRecipes );

        router.get( '/recipes/favourites', verifyToken, this.recipeController.getFavouriteRecipes );

        router.get( '/recipes/:id', verifyToken, this.recipeController.getRecipeById );

        router.put( '/recipes/:id', verifyToken, this.recipeController.updateRecipeById );

        router.delete( '/recipes/:id', verifyToken, this.recipeController.deleteRecipeById );
    }
}