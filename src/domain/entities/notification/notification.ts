export default interface INotification {
  _id?: string;
  isRead: boolean;
  url: string;
  from: string;
  fromModel: "User" | "Agent" | "Admin";
  to: string;
  toModel: "User" | "Agent" | "Admin";
  message: string;
  createdAt: Date;
}
export interface NotificationRepository {
  saveNotification(data: INotification): Promise<INotification | null>;
  getAgentNotifications(id: string): Promise<INotification[] | null>;
  getUserNotifications(id: string): Promise<INotification[] | null>;
  getAdminNotifications(id: string): Promise<INotification[] | null>;
}
