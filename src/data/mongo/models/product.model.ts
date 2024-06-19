import mongoose, { Schema } from "mongoose";
import  Mongoose  from "mongoose";

const productSchema = new Mongoose.Schema({
    name: {
        type:String,
        required: [true, 'Name is required'],
        unique: true
    },
    
    available:{
        type: Boolean,
        default: false
    },
    price: {
        type: Number,
        default:0,
        
    },
    description:{
        type:String,
    },
    user:{
        type: Schema.Types.ObjectId, // Id de mongo
        ref: 'User',
        required:true
    },
    category:{
        type: Schema.Types.ObjectId, // Id de mongo
        ref: 'Category',
        required:true
    }

});

productSchema.set('toJSON',{
    virtuals:true,
    versionKey:false,
    transform: function(doc,ret,options){
        delete ret._id;

    }
}
    
,)



export const ProductModel = mongoose.model('Product',productSchema)