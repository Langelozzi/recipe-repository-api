import { verifyToken } from '../helpers/auth/verifyToken';
import { AuthController } from './../controllers/auth.controller';

export class AuthRoutes {
    authController: AuthController = new AuthController();

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    constructor() {}

    public routes( app: any ): void {
        app.post( '/api/auth/register', this.authController.registerUser );

        app.post( '/api/auth/login', this.authController.loginUser );

        app.get( '/api/auth/current-user', verifyToken, this.authController.getCurrentUser );

        app.get( '/api/auth/verify-token', this.authController.verifyToken );
    }
}
