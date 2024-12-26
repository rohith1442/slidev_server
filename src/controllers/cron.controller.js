
import BackupService from "../services/backup.service.js";


export default class CronController{
  constructor() {
    this.backupService = new BackupService();
  }

   // Define an asynchronous function for the backup job
    runBackupJob = async (req, res) => {
    try {
      console.log("Starting scheduled backup...");
      await this.backupService.backupFiles(); // Await the backup process
      console.log("Scheduled backup completed successfully.");
      
    } catch (err) {
      console.error("Scheduled backup failed:", err);
    }
  }
}

// Schedule the backup job to run every day at midnight

