import { promises as fs } from "fs";
import path from "path";



export const deleteFile = async (filePath) => {
    try {
      await fs.unlink(filePath);
    } catch (err) {
      console.error(`Error deleting file ${filePath}:`, err);
      throw err;
    }
  };
  
  export const deleteDirectory = async (dirPath) => {
    try {
      await fs.rm(dirPath, { recursive: true, force: true });
    } catch (err) {
      console.error(`Error deleting directory ${dirPath}:`, err);
      throw err;
    }
};
export const writeFile = async (filePath, content) => {
    try {
      await fs.writeFile(filePath, content, 'utf8');
    } catch (err) {
      console.error(`Error writing to file ${filePath}:`, err);
      throw err;
    }
  };

  export const readFilesInDirectory = async (dirPath, extension) => {
    try {
      const files = await fs.readdir(dirPath);
      return files.filter((file) => file.endsWith(extension));
    } catch (err) {
      console.error(`Error reading files in directory ${dirPath}:`, err);
      throw err;
    }
  };
  
export const readDirectoriesInDirectory = async (dirPath) => {
    try {
      const files = await fs.readdir(dirPath);
      const directories = [];
      for (const file of files) {
        const fullPath = path.join(dirPath, file);
        const stats = await fs.stat(fullPath);
        if (stats.isDirectory()) {
          directories.push(file);
        }
      }
      return directories;
    } catch (err) {
      console.error(`Error reading directories in ${dirPath}:`, err);
      throw err;
    }
  };
  export const fileExists = async (filePath) => {
    try {
      console.log("========>",filePath)
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  };
