"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const LogSchema = new Schema({
    message: {
        type: String,
        required: true
    },
    code: {
        type: Number,
        required: false
    },
    plainTextMessage: {
        type: String,
        required: false
    }
}, {
    timestamps: true,
});
exports.LogModel = mongoose_1.default.model('Log', LogSchema);
