import { Router } from 'express';
import { getHome } from '../controllers/homeController';
import { createSimulation } from '../controllers/simulationController';

const router = Router();

router.get('/', getHome);
router.post('/api/simulations', createSimulation);

export default router;

