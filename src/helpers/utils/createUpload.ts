import multer from 'multer';
import { UserModel } from '../../models/user.model';
import * as fs from 'fs';
import path from 'path';

function saveUploadedImage() {
    const storage = multer.diskStorage( {

        destination: async function ( req, file, cb ) {
            const currentUser = await UserModel.findOne( { _id: req.user } );

            const userUploadsDir = path.join( `src/uploads/${ currentUser?._id }` );

            if ( !fs.existsSync( userUploadsDir ) ) {
                fs.mkdirSync( userUploadsDir );
            }

            cb( null, userUploadsDir );
        },
        filename: function ( req, file, cb ) {
            cb( null, `${file.originalname}` );
        }
     
    } );
     
    const upload = multer( { storage: storage } );

    return upload;
}

export const upload = saveUploadedImage();