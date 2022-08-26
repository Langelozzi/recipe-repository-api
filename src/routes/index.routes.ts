export class IndexRoutes {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    constructor() {}

    public routes( router: any ): void {
        router.get( '/', ( req: any, res: any ) => { res.json( { 'ok': true } ); } );
    }
}