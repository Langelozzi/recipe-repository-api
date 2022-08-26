"use strict";
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
exports.logger = void 0;
const log_model_1 = require("../../models/log.model");
function logger(message, code, plainTextMessage) {
    return __awaiter(this, void 0, void 0, function* () {
        const newLogEntry = new log_model_1.LogModel({
            message: message,
            code: code,
            plainTextMessage: plainTextMessage
        });
        try {
            const savedLog = yield newLogEntry.save();
        }
        catch (e) {
            console.log('Log entry failed to save');
        }
    });
}
exports.logger = logger;
