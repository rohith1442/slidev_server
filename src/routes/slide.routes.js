import {Router} from 'express';

import SlideController from '../controllers/slide.controller.js';
import { fileUpload } from '../middlewares/fileUpload.js';

const router = Router();
const slideController = new SlideController();

router.post('/upload-batch',fileUpload,slideController.createSlideDeck);
router.get('/list-decks',slideController.getAllSlideDecks);
router.put('/update-slide/:name',slideController.updateSlide);


router.get('/health',slideController.healthCheck);


export default router;