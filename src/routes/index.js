import { Router } from 'express';
import httpStatus from 'http-status';
import slideRoutes from './slide.routes.js'
const router = Router();


router.use('/slides', slideRoutes);

// Root path route
router.get('/', (req, res) => {
  res.status(httpStatus.OK).json({
    payload: {
      error: '',
      message: '',
      code: httpStatus.OK,
    },
  });
});

export default router;
