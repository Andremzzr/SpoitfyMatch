const express = require('express');
const router = express.Router();



const {
  loginIntoSpotify,
  callbackUrl,
  getToken,
  getUserArtists,
  callbackMatch
}=  require('../controllers/AuthController.js')



function authorizeUser(req,res,next) {
  if(req.query.access_token != undefined){
    next();
  }
  else{
    console.log("Access token was not found");
    res.redirect('/');
  }
}


router.get('/login', loginIntoSpotify);

router.get('/callback', callbackUrl);

router.get('/callback', callbackMatch);
    
router.get('/getToken', authorizeUser, getToken);


router.get('/artist/:userId', authorizeUser, getUserArtists);




module.exports = router;