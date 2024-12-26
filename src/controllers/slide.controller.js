import SlideService from "../services/slide.service.js";
import BackupService from "../services/backup.service.js";

export default class SlideController {
  constructor() {
    this.slideService = new SlideService();
    this.backupService = new BackupService();
  }
  createSlideDeck = async (req, res) => {
    try {
      if (!req.files || req.files.length === 0) {
        throw new Error("No files uploaded.");
      }

      await this.slideService.processFiles(req.files);
      res.status(201).json({
        message: "Batch presentations generated successfully with versioning!",
      });
    } catch (err) {
      console.log(err);
      res
        .status(500)
        .json({ error: "Error during batch build:", message: err.message });
    }
  };

  getAllSlideDecks = async (req, res) => {
    try {
      const decks = await this.slideService.getDecks();
      res.status(200).json({
        message: "All Decks fetched successfully",
        decks,
      });
    } catch (err) {
      console.error("Error fetching decks:", err);
      res
        .status(500)
        .json({ error: "An error occurred while listing the decks." });
    }
  };

  updateSlide = async (req, res) => {
    const { content } = req.body;
    const { name } = req.params;

    try {
      if (!name || !content) {
        throw new Error('Both "name" and "content" fields are required.');
      }

      await this.slideService.updateSlide(name, content);

      res.status(200).json({
        message: `Slide updated and saved  successfully: ${name}`,
      });
    } catch (err) {
      console.error("Error updating slide:", err);
      res.status(500).json({ error: `Error updating slide: ${err.message}` });
    }
  };

  deleteSlide = async (req, res) => {
    const { name } = req.params;

    try {
      if (!name) {
        throw new Error("Slide name is required.");
      }

      await this.slideService.deleteSlide(name);

      res.status(200).json({
        message: `Slide deck ${name} and all versions deleted successfully from both uploads and dist.`,
      });
    } catch (err) {
      console.error("Error deleting slide:", err);
      res.status(500).send(`Error deleting slide: ${err.message}`);
    }
  };

  startBackup = async (req, res) => {
    try {
      console.log("Starting manual backup...");
      await this.backupService.backupFiles();
      res.status(200).json({
        message: "Backup started successfully.",  
      }); 
    } catch (err) {
      console.error("Backup failed:", err);
      res.status(500).send("Backup failed.");
    }
  };
  healthCheck = async (req, res) => {
    try {
      const healthcheck = { title: "systemTest" };
      res.status(200).json({ message: "healthcheck", healthcheck });
    } catch (err) {
      res.status(500).json({ error: "error", err });
    }
  };
}
