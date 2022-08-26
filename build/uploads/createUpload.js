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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const user_model_1 = require("../models/user.model");
const fs = __importStar(require("fs"));
const path_1 = __importDefault(require("path"));
function saveUploadedImage() {
    const storage = multer_1.default.diskStorage({
        destination: function (req, file, cb) {
            return __awaiter(this, void 0, void 0, function* () {
                const currentUser = yield user_model_1.UserModel.findOne({ _id: req.user });
                const userUploadsDir = path_1.default.join(__dirname + `/${currentUser === null || currentUser === void 0 ? void 0 : currentUser._id}`);
                if (!fs.existsSync(userUploadsDir)) {
                    fs.mkdirSync(userUploadsDir);
                }
                cb(null, userUploadsDir);
            });
        },
        filename: function (req, file, cb) {
            cb(null, `${file.originalname}`);
        }
    });
    const upload = (0, multer_1.default)({ storage: storage });
    return upload;
}
exports.upload = saveUploadedImage();
