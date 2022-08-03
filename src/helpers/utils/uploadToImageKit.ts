import { Request, Response } from 'express';
import * as fs from 'fs';
import { imagekit } from './createImageKit';


export function uploadToImageKit( req: Request, res: Response, images: any, userId: any ): string[] {
    let imagePaths: string[] = [];

    for ( const image of images ) {
        // reading the file that was saved to the server file system
        fs.readFile( image.path, ( err, data ) => {
            if ( err ) console.log( err );

            // uploading the image to the users imagekit folder
            imagekit.upload({
                file: data,
                fileName: `${req.body.name}`,
                folder: `${userId}`
            }, ( err: any, data: any ) => {
                if ( err ) res.send( err );

                imagePaths.push( data.url );
            })

        })

        // removing the file from the server file system once it is uploaded
        if ( fs.existsSync( image.path ) ) {
            fs.unlinkSync( image.path );
        }
    }

    return imagePaths;
}