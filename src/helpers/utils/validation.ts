import Joi from 'joi';

export function registerValidation( data: any ) {
    const validationSchema = Joi.object( {
        email: Joi.string().required().email(),
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        password: Joi.string().required().min( 8 )
    } );

    return validationSchema.validate( data );
}

export function loginValidation( data: any ) {
    const validationSchema = Joi.object( {
        email: Joi.string().required().email(),
        password: Joi.string().required().min( 8 )
    } );

    return validationSchema.validate( data );
}