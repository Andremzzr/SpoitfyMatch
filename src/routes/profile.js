const express = require('express');
const router = express.Router();

const {
    getUserLink,
    matchWithFriend
} = require('../controllers/ProfileController');


router.get('/link/:userId', getUserLink);
router.get('/match/:userLink', matchWithFriend);





module.exports = router;