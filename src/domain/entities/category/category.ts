import { ObjectId } from "mongoose";

export interface Icategory{
    _id?:string,
    category_name:string,
    discription:string,
    image:string,
    is_block?:boolean
}