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
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadToImageKit = void 0;
const fs = __importStar(require("fs"));
const createImageKit_1 = require("./createImageKit");
function uploadToImageKit(req, res, images, userId) {
    let imagePaths = [];
    for (const image of images) {
        // reading the file that was saved to the server file system
        fs.readFile(image.path, (err, data) => {
            if (err)
                console.log(err);
            // uploading the image to the users imagekit folder
            createImageKit_1.imagekit.upload({
                file: data,
                fileName: `${req.body.name}`,
                folder: `${userId}`
            }, (err, data) => {
                if (err)
                    res.send(err);
                imagePaths.push(data.url);
            });
        });
        // removing the file from the server file system once it is uploaded
        if (fs.existsSync(image.path)) {
            fs.unlinkSync(image.path);
        }
    }
    return imagePaths;
}
exports.uploadToImageKit = uploadToImageKit;
