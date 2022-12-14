"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginValidation = exports.registerValidation = void 0;
const joi_1 = __importDefault(require("joi"));
function registerValidation(data) {
    const validationSchema = joi_1.default.object({
        email: joi_1.default.string().required().email(),
        firstName: joi_1.default.string().required(),
        lastName: joi_1.default.string().required(),
        password: joi_1.default.string().required().min(8)
    });
    return validationSchema.validate(data);
}
exports.registerValidation = registerValidation;
function loginValidation(data) {
    const validationSchema = joi_1.default.object({
        email: joi_1.default.string().required().email(),
        password: joi_1.default.string().required().min(8)
    });
    return validationSchema.validate(data);
}
exports.loginValidation = loginValidation;
