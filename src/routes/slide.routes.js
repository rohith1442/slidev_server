import {Router} from 'express';
import cron from "node-cron";

import SlideController from '../controllers/slide.controller.js';
import CronController  from '../controllers/cron.controller.js';
import { fileUpload } from '../middlewares/fileUpload.js';

const router = Router();
const slideController = new SlideController();
const cronController = new CronController();


router.post('/upload-batch',fileUpload,slideController.createSlideDeck);
router.get('/list-decks',slideController.getAllSlideDecks);
router.put('/update-slide/:name',slideController.updateSlide);
router.delete('/delete-slide/:name',slideController.deleteSlide);
router.get('/backup',slideController.startBackup);

cron.schedule('00 00 * * *', cronController.runBackupJob, {
    timezone: 'Asia/Kolkata',
  });


router.get('/health',slideController.healthCheck);


export default router;