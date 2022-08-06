import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const LogSchema = new Schema( {
    message: {
        type: String,
        required: true
    },
    code: {
        type: Number,
        required: false
    },
    plainTextMessage: {
        type: String,
        required: false
    }
},
{
    timestamps: true,
    
} );

export const LogModel = mongoose.model( 'Log', LogSchema );