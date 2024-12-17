import { Dependencies } from "../../../domain/entities/depencies/depencies";
import { NotificationRepository } from "../../../domain/entities/notification/notification";

export default class NotificationUseCase {
  private _NotificationRepository: NotificationRepository;
  constructor(dependencies: Dependencies) {
    this._NotificationRepository =
      dependencies.Repositories.NotificationRepository;
  }
  async getAgentNotifications(agentId: string) {
    try {
      const notifications = await this._NotificationRepository.getAgentNotifications(
        agentId
      );
      return notifications;
    } catch (error) {
        throw error
    }
  }
  async getUserNotifications(userId: string) {
    try {
      const notifications = await this._NotificationRepository.getUserNotifications(
        userId
      );
      return notifications;
    } catch (error) {
        throw error
    }
  }
  async getAdminNotifications(adminId: string) {
    try {
      const notifications = await this._NotificationRepository.getAdminNotifications(
        adminId
      );
      return notifications;
    } catch (error) {
        throw error
    }
  }
}
