import { promises as fs } from "fs";
import path from "path";
import { exec } from "child_process";
import { promisify } from "util";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const execPromise = promisify(exec);



export const buildSlidev = async (filePath) => {
  try {
    const uniqueDir = path.join(
      __dirname,
      "../../dist",
      path.basename(filePath, path.extname(filePath)) + `_${Date.now()}`
    );
    await fs.mkdir(uniqueDir, { recursive: true });

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






