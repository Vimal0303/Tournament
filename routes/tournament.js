import express from 'express';
const router = express.Router();
import TournamentController from '../controllers/TournamentController.js';

// create tournament
router.post('/create', TournamentController.createTournament);
// get all tournament
router.get('/get', TournamentController.listAllTournaments);
// update tournament
router.post('/update', TournamentController.updateTournament);
// delete tournament
router.post('/delete', TournamentController.deleteTournament);

export default router;