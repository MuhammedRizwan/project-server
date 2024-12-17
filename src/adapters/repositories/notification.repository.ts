import INotification from "../../domain/entities/notification/notification";
import NotificationModel from "../database/models/notification.model";

export class NotificationRepository {
  async saveNotification(data: INotification): Promise<INotification | null> {
    try {
      const savedNotification = await NotificationModel.create(data);
      return savedNotification as unknown as INotification;
    } catch (error) {
      throw error;
    }
  }
  async getAgentNotifications(Id: string): Promise<INotification[] | null> {
    try {
      const notifications = await NotificationModel.find({
        $or: [
          { to: null, toModel: "Agent" },
          { to: Id }, 
        ],
      }).populate("from");
      return notifications as unknown as INotification[];
    } catch (error) {
      throw error;
    }
  }
  async getUserNotifications(Id: string): Promise<INotification[] | null> {
    try {
      const notifications = await NotificationModel.find({
        $or: [
          { to: null, toModel: "User" },
          { to: Id }, 
        ],
      }).populate("from");
      return notifications as unknown as INotification[];
    } catch (error) {
      throw error;
    }
  }
  async getAdminNotifications(Id: string): Promise<INotification[] | null> {
    try {
      const notifications = await NotificationModel.find({
        $or: [
          { to: null, toModel: "Admin" },
          { to: Id }, 
        ],
      }).populate("from");
      return notifications as unknown as INotification[];
    } catch (error) {
      throw error;
    }
  }
}
