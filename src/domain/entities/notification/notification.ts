export default interface Notification{
    _id?: string;
    isRead: boolean;
    url: string;
    from: string;
    to: string;
    message: string;
    createdAt: Date;
  }
export interface NotificationRepository{

}
  