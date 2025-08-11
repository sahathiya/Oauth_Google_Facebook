import mongoose, { Document, Schema } from "mongoose";
export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  image:string
}
const userShema:Schema<IUser>=new Schema({
    name:{type:String,required:true},
    email:{type:String,required:true},
    image:{type:String},
    password:{type:String}
})



export const User=mongoose.model<IUser>("User",userShema)