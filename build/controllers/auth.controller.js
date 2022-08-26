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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const bcrypt = __importStar(require("bcryptjs"));
const generateAccessToken_1 = require("../helpers/auth/generateAccessToken");
const validation_1 = require("../helpers/utils/validation");
const user_model_1 = require("../models/user.model");
const jwt = __importStar(require("jsonwebtoken"));
const logger_1 = require("../helpers/utils/logger");
class AuthController {
    registerUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // Validate the data before we create the user
            const { error } = (0, validation_1.registerValidation)(req.body);
            if (error) {
                (0, logger_1.logger)(error === null || error === void 0 ? void 0 : error.details[0].message, undefined, 'Register validation failed');
                return res.status(400).send(error === null || error === void 0 ? void 0 : error.details[0].message);
            }
            // Checking if the user already exists
            const emailExist = yield user_model_1.UserModel.findOne({ email: req.body.email });
            if (emailExist) {
                (0, logger_1.logger)('This email is already registered', 400);
                return res.status(400).send('Email already exists');
            }
            // Hash the password
            const salt = yield bcrypt.genSalt(10);
            const hashedPassword = yield bcrypt.hash(req.body.password, salt);
            // Create new user
            const user = new user_model_1.UserModel({
                email: req.body.email,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                password: hashedPassword
            });
            // Save them if no errors occur
            try {
                const savedUser = yield user.save();
                res.send(savedUser);
            }
            catch (err) {
                (0, logger_1.logger)(err.message, undefined, 'Failed to save new user');
                res.status(400).send(err);
            }
        });
    }
    loginUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // Validate the data before we create the user
            const { error } = (0, validation_1.loginValidation)(req.body);
            if (error) {
                (0, logger_1.logger)(error === null || error === void 0 ? void 0 : error.details[0].message, undefined, 'Login validation failed');
                return res.status(400).send(error === null || error === void 0 ? void 0 : error.details[0].message);
            }
            const user = yield user_model_1.UserModel.findOne({ email: req.body.email });
            // Checking if a user exists with that email
            if (!user) {
                (0, logger_1.logger)('No account registered with that email', undefined);
                return res.status(400).send('No account registered with that email');
            }
            // Checking if the password is correct
            const validPass = yield bcrypt.compare(req.body.password, user.password);
            if (!validPass) {
                (0, logger_1.logger)('Password is incorrect', undefined);
                return res.status(400).send('Incorrect Password');
            }
            // Create an access token for the user
            const accessToken = (0, generateAccessToken_1.generateAccessToken)(user);
            res.json({
                accessToken: accessToken,
            });
        });
    }
    getCurrentUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentUser = yield user_model_1.UserModel.findOne({ _id: req.user });
            res.json(currentUser);
        });
    }
    verifyToken(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const token = req.header('Access-Token');
            if (!token) {
                return res.status(401).send('Access Denied');
            }
            try {
                const verified = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
                req.user = verified;
                res.status(200).json({
                    ok: true,
                    valid: true
                });
            }
            catch (err) {
                (0, logger_1.logger)(err.message, undefined, 'Login failed, invalid token');
                res.status(401).send('Invalid Token').json({
                    ok: false,
                    valid: false
                });
            }
        });
    }
}
exports.AuthController = AuthController;
