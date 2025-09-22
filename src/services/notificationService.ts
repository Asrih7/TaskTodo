import { LocalNotifications } from '@capacitor/local-notifications';
import { Task } from '../interfaces';

class NotificationService {
  private hasPermission = false;

  async initialize() {
    try {
      // Request permission for notifications
      const permission = await LocalNotifications.requestPermissions();
      this.hasPermission = permission.display === 'granted';
      return this.hasPermission;
    } catch (error) {
      console.error('Failed to initialize notifications:', error);
      return false;
    }
  }

  async scheduleTaskReminder(task: Task) {
    if (!this.hasPermission || !task.time || task.completed) {
      return;
    }

    try {
      // Parse the date and time
      const [year, month, day] = task.date.split('-');
      const [hours, minutes] = task.time.split(':');
      
      const reminderDate = new Date(
        parseInt(year),
        parseInt(month) - 1, // Month is 0-indexed
        parseInt(day),
        parseInt(hours),
        parseInt(minutes)
      );

      // Don't schedule notifications for past times
      if (reminderDate <= new Date()) {
        return;
      }

      // Schedule the notification
      await LocalNotifications.schedule({
        notifications: [
          {
            title: 'Task Reminder',
            body: `Don't forget: ${task.title}`,
            id: parseInt(task.id.replace(/\D/g, '')) || Date.now(), // Convert ID to number
            schedule: { at: reminderDate },
            sound: 'default',
            actionTypeId: 'TASK_REMINDER',
            extra: {
              taskId: task.id
            }
          }
        ]
      });

      console.log(`Notification scheduled for ${task.title} at ${reminderDate}`);
    } catch (error) {
      console.error('Failed to schedule notification:', error);
    }
  }

  async cancelTaskReminder(taskId: string) {
    try {
      const numericId = parseInt(taskId.replace(/\D/g, '')) || Date.now();
      await LocalNotifications.cancel({
        notifications: [{ id: numericId }]
      });
    } catch (error) {
      console.error('Failed to cancel notification:', error);
    }
  }

  async updateTaskReminder(task: Task) {
    // Cancel existing notification and create a new one
    await this.cancelTaskReminder(task.id);
    await this.scheduleTaskReminder(task);
  }
}

export const notificationService = new NotificationService();