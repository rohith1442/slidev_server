import { promises as fs } from "fs";
import path from "path";

import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default class BackupService {
  async copyDirectory(source, destination) {
    try {
      const entries = await fs.readdir(source, { withFileTypes: true });

      // Create the destination directory if it doesn't exist
      await fs.mkdir(destination, { recursive: true });

      for (let entry of entries) {
        const sourcePath = path.join(source, entry.name);
        const destPath = path.join(destination, entry.name);

        if (entry.isDirectory()) {
          await this.copyDirectory(sourcePath, destPath);
        } else {
          fs.copyFile(sourcePath, destPath);
        }
      }
      console.log(`Backup completed for ${source}`);
    } catch (err) {
      console.error(
        `Error copying directory ${source} to ${destination}:`,
        err
      );
      throw err;
    }
  }

  async backupFiles() {
    try {
      const backupDir = path.join(__dirname, "../../backup");
      const uploadsDir = path.join(__dirname, "../../uploads");
      const distDir = path.join(__dirname, "../../dist");

      // Define backup paths for uploads and dist
      const backupUploadsDir = path.join(backupDir, "uploads");
      const backupDistDir = path.join(backupDir, "dist");

      // Ensure the backup directory exists
      await fs.mkdir(backupDir, { recursive: true });

      // Copy the uploads and dist directories
      await this.copyDirectory(uploadsDir, backupUploadsDir);
      await this.copyDirectory(distDir, backupDistDir);

      console.log("Backup process completed successfully.");
    } catch (err) {
      throw err;
    }
  }
}
