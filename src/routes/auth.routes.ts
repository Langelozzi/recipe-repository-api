import { verifyToken } from '../helpers/auth/verifyToken';
import { AuthController } from './../controllers/auth.controller';

export class AuthRoutes {
    authController: AuthController = new AuthController();

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    constructor() {}

    public routes( router: any ): void {
        router.post( '/auth/register', this.authController.registerUser );

        router.post( '/auth/login', this.authController.loginUser );

        router.get( '/auth/current-user', verifyToken, this.authController.getCurrentUser );

        router.get( '/auth/verify-token', this.authController.verifyToken );
    }
}
