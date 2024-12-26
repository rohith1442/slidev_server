import { promises as fs } from "fs";
import path from "path";
import { exec } from "child_process";
import { promisify } from "util";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const execPromise = promisify(exec);

export const fileExists = async (filePath) => {
  try {
    console.log("========>",filePath)
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
};

export const buildSlidev = async (filePath) => {
  try {
    const uniqueDir = path.join(
      __dirname,
      "../../dist",
      path.basename(filePath, path.extname(filePath)) + `_${Date.now()}`
    );

    // Create a unique directory for each presentation
    await fs.mkdir(uniqueDir, { recursive: true });

    // Execute Slidev build command with the output path
    const { stdout } = await execPromise(
      `slidev build ${filePath} --out ${uniqueDir}`
    );

    console.log(stdout);
  } catch (err) {
    console.error(
      `Error during Slidev build for ${filePath}:`,
      err.message || err
    );
    throw new Error(`Error building ${filePath}`);
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

export const writeFile = async (filePath, content) => {
    try {
      await fs.writeFile(filePath, content, 'utf8');
    } catch (err) {
      console.error(`Error writing to file ${filePath}:`, err);
      throw err;
    }
  };