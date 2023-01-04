import express from 'express';
const router = express.Router();
import MappingController from '../controllers/MappingController.js';

// assign player to tournament
router.post('/assign', MappingController.assignPlayer);
// remove player from tournament
router.post('/remove', MappingController.removePlayer);

export default router;