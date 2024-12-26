import path from "path";
import { promises as fs } from "fs";
import { buildSlidev } from "../helpers/slide.helper.js";

import {
  fileExists,
  readFilesInDirectory,
  readDirectoriesInDirectory,
  writeFile,
  deleteFile,
  deleteDirectory,
} from "../helpers/fileSystem.helper.js";

import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default class SlideService {
  async saveFileWithVersion(filePath, uploadDir) {
    try {
      const { name: baseName, ext } = path.parse(filePath);
      for (let version = 1; ; version++) {
        const versionedFilePath = path.join(
          uploadDir,
          `${baseName}-v${version}${ext}`
        );
        const exists = await fileExists(versionedFilePath);

        if (!exists) {
          await fs.rename(filePath, versionedFilePath);
          console.log(`File saved as: ${versionedFilePath}`);
          return versionedFilePath;
        }
      }
    } catch (err) {
      console.log(err);
      console.error(`Error saving file with version: ${err.message}`);
      throw new Error(`Failed to save file: ${filePath}`);
    }
  }

  async processFiles(files) {
    try {
      const uploadDir = path.join(__dirname, "../../uploads");
      const filePaths = files.map((file) =>
        path.join(uploadDir, file.originalname)
      );

      for (const filePath of filePaths) {
        try {
          const versionedFilePath = await this.saveFileWithVersion(
            filePath,
            uploadDir
          );
          await buildSlidev(versionedFilePath);
        } catch (err) {
          console.log(err);
          console.error(`Error processing file: ${filePath} - ${err.message}`);
          throw new Error(`Failed to process file: ${filePath}`);
        }
      }
    } catch (err) {
      console.error(`Error processing files: ${err.message}`);
      throw err;
    }
  }

  async getDecks() {
    const uploadsDir = path.join(__dirname, "../../uploads");
    const distDir = path.join(__dirname, "../../dist");

    const decks = [];

    // Check for Markdown files in uploads directory
    if (await fileExists(uploadsDir)) {
      const markdownFiles = await readFilesInDirectory(uploadsDir, ".md");
      markdownFiles.forEach((file) => {
        decks.push({
          name: file,
          type: "source",
          path: `/uploads/${file}`,
        });
      });
    } else {
      console.warn(`Uploads directory not found: ${uploadsDir}`);
    }

    // Check for HTML files in dist directory
    if (await fileExists(distDir)) {
      const subDirs = await readDirectoriesInDirectory(distDir);
      for (const subDir of subDirs) {
        const subDirPath = path.join(distDir, subDir);
        const htmlFiles = await readFilesInDirectory(subDirPath, "index.html");
        htmlFiles.forEach((file) => {
          decks.push({
            name: file,
            type: "presentation",
            path: `/dist/${subDir}/${file}`, // Adjusted path to include subdirectory
          });
        });
      }
    } else {
      console.warn(`Dist directory not found: ${distDir}`);
    }

    return decks;
  }

  async updateSlide(name, content) {
    try {
      const uploadDir = path.join(__dirname, "../../uploads");
      const filePath = path.join(uploadDir, name);

      // Check if the file exists
      if (!(await fileExists(filePath))) {
        throw new Error(`Slide file not found: ${name}`);
      }

      const versionedFilePath = await this.saveFileWithVersion(
        filePath,
        uploadDir
      );
      await writeFile(versionedFilePath, content);
      await buildSlidev(versionedFilePath);
      return;
    } catch (err) {
      throw err;
    }
  }

  async deleteSlide(name) {
    try {
      const { name: baseName, ext } = path.parse(name);

      const uploadsDir = path.join(__dirname, "../../uploads");
      const uploadFiles = await readFilesInDirectory(uploadsDir,'.md');
      const slideFiles = uploadFiles.filter(
        (file) => file.startsWith(baseName) && file.endsWith(ext)
      );

      if (slideFiles.length === 0) {
        throw new Error(`Slide not found: ${name}`);
      }

      // Delete all versioned files in the 'uploads' folder
      for (const file of slideFiles) {
        const filePath = path.join(uploadsDir, file);
        await deleteFile(filePath);
        console.log(`Deleted file from uploads: ${filePath}`);
      }

      // Now handle deleting the corresponding folder in the 'dist' folder
      const distDir = path.join(__dirname,"../../dist");
      const distSubfolders = await readDirectoriesInDirectory(distDir);
      const distFoldersToDelete = distSubfolders.filter(
        (subfolder) => subfolder.startsWith(baseName) // Match subfolders with the slide name
      );

      // Delete all timestamped subfolders corresponding to the slide
      for (const subfolder of distFoldersToDelete) {
        const subfolderPath = path.join(distDir, subfolder);
        await deleteDirectory(subfolderPath);
        console.log(`Deleted folder from dist: ${subfolderPath}`);
      }

      return;
    } catch (err) {
      throw err;
    }
  }
}
