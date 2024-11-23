import { model, Schema } from "mongoose";

const postSchema = new Schema(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    image:[{type:String}],
    caption:{type:String,required:true},
    location:{type:String,required:true},
    like:[{
        liked_user:{ type: Schema.Types.ObjectId, ref: "User", required: true },
        emoji:{type:String},
        created_At:{type:Date,default:new Date()},
    }
    ],
    comment:[
        {
            user_id:{ type: Schema.Types.ObjectId, ref: "User", required: true },
            message:{type:String,required:true},
            created_At:{type:Date,default:new Date()}
        }
    ],
  },
  {
    timestamps: true,
  }
);
const postModel = model("Post", postSchema);
export default postModel;
