import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const UserSchema = new Schema( {
    email: {
        type: String,
        lowercase: true,
        required: true,
        unique: true
    },
    
    firstName: {
        type: String,
        required: true
    },
    
    lastName: {
        type: String,
        required: true
    },

    password: {
        type: String,
        required: true,
        min: 8
    },
    date: {
        type: Date,
        default: Date.now
    }
},
{
    timestamps: true,
    
} );

export const UserModel = mongoose.model( 'User', UserSchema );