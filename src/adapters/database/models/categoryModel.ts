import { model, Schema } from "mongoose";

const categorySchema = new Schema(
  {
    category_name: { type: String, required: true },
    description: { type: String, required: true },
    image:{type:String,required:true},
    is_block: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);
const categoryModel = model("Category", categorySchema);
export default categoryModel;
