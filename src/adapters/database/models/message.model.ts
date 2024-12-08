import { model, Schema } from "mongoose";

const messageSchema = new Schema(
  {
    chatId: { type: Schema.Types.ObjectId, ref: "Chat", required: true },
    senderId: { type: String, required: true },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    message_type: { type: String, required: true },
    message_time: { type: Date, default: new Date() },
  },
  {
    timestamps: true,
  }
);

const messageModel = model("Message", messageSchema);
export default messageModel;
