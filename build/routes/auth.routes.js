"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRoutes = void 0;
const verifyToken_1 = require("../helpers/auth/verifyToken");
const auth_controller_1 = require("./../controllers/auth.controller");
class AuthRoutes {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    constructor() {
        this.authController = new auth_controller_1.AuthController();
    }
    routes(router) {
        router.post('/auth/register', this.authController.registerUser);
        router.post('/auth/login', this.authController.loginUser);
        router.get('/auth/current-user', verifyToken_1.verifyToken, this.authController.getCurrentUser);
        router.get('/auth/verify-token', this.authController.verifyToken);
    }
}
exports.AuthRoutes = AuthRoutes;
