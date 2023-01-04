import express from 'express';
const router = express.Router();
import PlayerController from '../controllers/PlayerController.js';

// create player
router.post('/create', PlayerController.createPlayer);
// get all players
router.get('/get', PlayerController.listAllPlayer);
// update player
router.post('/update', PlayerController.updatePlayer);
// delete player
router.post('/delete', PlayerController.deletePlayer);

export default router;