"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IndexRoutes = void 0;
class IndexRoutes {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    constructor() { }
    routes(router) {
        router.get('/', (req, res) => { res.json({ 'ok': true }); });
    }
}
exports.IndexRoutes = IndexRoutes;
