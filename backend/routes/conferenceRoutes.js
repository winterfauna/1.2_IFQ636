const express = require('express');
const { getConferences, addConference, updateConference, deleteConference } = require('../controllers/conferenceController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/').get(protect, getConferences).post(protect, addConference);
router.route('/:id').put(protect, updateConference).delete(protect, deleteConference);

module.exports = router;