import { Schema, model } from "mongoose";

const NotificationSchema: Schema = new Schema(
  {
    message: {
      type: String,
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    url: {
      type: String,
    },
    from: {
      type: Schema.Types.ObjectId,
      refPath: "fromModel",
      required: true,
    },
    fromModel: {
      type: String,
      required: true,
      enum: ["User", "Agent"],
    },
    to: {
      type: Schema.Types.ObjectId,
      refPath: "toModel",
      required: true,
    },
    toModel: {
      type: String,
      required: true,
      enum: ["User", "Agent"],
    },
  },
  {
    timestamps: true,
  }
);

const NotificationModel = model("Notification", NotificationSchema);
export default NotificationModel;
