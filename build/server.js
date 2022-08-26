"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const logger_1 = __importDefault(require("./helpers/utils/logger"));
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();
const port = process.env.PORT || 3000;
app_1.default.listen(port, () => {
    logger_1.default.info(`App started on port ${port}`);
});
