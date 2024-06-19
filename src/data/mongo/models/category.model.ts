import mongoose, { Schema } from "mongoose";
import  Mongoose  from "mongoose";

const categorySchema = new Mongoose.Schema({
    name: {
        type:String,
        required: [true, 'Name is required'],
        unique:true,
    },
    
    available:{
        type: Boolean,
        default: false
    },
    user:{
        type: Schema.Types.ObjectId, // Id de mongo
        ref: 'User',
        required:true
    }

});

categorySchema.set('toJSON',{
    virtuals:true,
    versionKey:false,
    transform: function(doc,ret,options){
        delete ret._id;
    }
}
    
,)

export const CategoryModel = mongoose.model('Category',categorySchema)