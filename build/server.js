"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();
// eslint-disable-next-line @typescript-eslint/no-var-requires
const serverless = require('serverless-http');
// const port = process.env.PORT || 3000;
// app.listen( port, () => {
//     console.log( `App started on port ${port}` );
// } );
// module.exports = app;
module.exports.handler = serverless(app_1.default);
