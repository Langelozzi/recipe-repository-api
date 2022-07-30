"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const body_parser_1 = __importDefault(require("body-parser"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const auth_routes_1 = require("./routes/auth.routes");
const connectToDb_1 = __importDefault(require("./helpers/utils/connectToDb"));
const recipe_routes_1 = require("./routes/recipe.routes");
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();
class App {
    constructor() {
        this.authRoutes = new auth_routes_1.AuthRoutes();
        this.recipeRoutes = new recipe_routes_1.RecipeRoutes();
        this.app = (0, express_1.default)();
        this.config();
        (0, connectToDb_1.default)();
        this.authRoutes.routes(this.app);
        this.recipeRoutes.routes(this.app);
    }
    config() {
        this.app.use(body_parser_1.default.json());
        this.app.use((req, res, next) => { next(); }, (0, cors_1.default)({}));
    }
}
exports.default = new App().app;
