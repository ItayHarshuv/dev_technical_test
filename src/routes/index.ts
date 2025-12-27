import { Router } from 'express';
import { getHome } from '../controllers/homeController';
import { createSimulation } from '../controllers/simulationController';
import { getAdmin } from '../controllers/adminController';

const router = Router();

router.get('/', getHome);
router.get('/admin', getAdmin);
router.post('/api/simulations', createSimulation);

export default router;

