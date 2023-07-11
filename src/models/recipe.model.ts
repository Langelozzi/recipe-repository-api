import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const RecipeSchema = new Schema( {
    userId: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    
    ingredients: {
        type: Array,
        required: false
    },
    
    steps: {
        type: Array,
        required: false
    },

    favourite: {
        type: Boolean,
        required: false,
        default: false
    },
    prepTime: {
        type: Number,
        required: false
    },
    cookTime: {
        type: Number,
        required: false
    },
    ovenTemp: {
        type: Number,
        required: false
    },
    notes: {
        type: String,
        required: false
    },
    cuisine: {
        type: String,
        required: false
    },
    facts: {
        type: Array,
        required: false
    },
    tags: {
        type: Array,
        required: false
    },
    description: {
        type: String,
        required: false
    },
    imageData: {
        type: Array,
        required: false
    },
    visibility: {
        type: Number,
        required: false,
        default: 1
    }
},
{
    timestamps: true,
    
} );

export const RecipeModel = mongoose.model( 'Recipe', RecipeSchema );