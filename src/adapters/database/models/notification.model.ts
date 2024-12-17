import { Schema, model } from "mongoose";

const NotificationSchema: Schema = new Schema(
  {
    heading: { type: String, required: true },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    url: { type: String },
    from: { type: Schema.Types.ObjectId, refPath: "fromModel", required: true },
    fromModel: {
      type: String,
      required: true,
      enum: ["User", "Agent", "Admin"],
    },
    to: { type: Schema.Types.ObjectId, refPath: "toModel" },
    toModel: { type: String, enum: ["User", "Agent", "Admin"] },
  },
  {
    timestamps: true,
  }
);

const NotificationModel = model("Notification", NotificationSchema);
export default NotificationModel;
