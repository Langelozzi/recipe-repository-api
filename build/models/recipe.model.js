"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecipeModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const RecipeSchema = new Schema({
    userId: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true,
        unique: true
    },
    ingredients: {
        type: Array,
        required: true
    },
    steps: {
        type: Array,
        required: true
    },
    favourite: {
        type: Boolean,
        required: false,
        default: false
    },
    prepTime: {
        type: Number,
        required: false
    },
    cookTime: {
        type: Number,
        required: false
    },
    ovenTemp: {
        type: Number,
        required: false
    },
    notes: {
        type: String,
        required: false
    },
    cuisine: {
        type: String,
        required: false
    },
    facts: {
        type: Array,
        required: false
    },
    tags: {
        type: Array,
        required: false
    },
    description: {
        type: String,
        required: false
    }
}, {
    timestamps: true,
});
exports.RecipeModel = mongoose_1.default.model('Recipe', RecipeSchema);
