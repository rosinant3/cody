const express2 = require('express');
const router = express2.Router();
const userControllers2 = require('../controllers/user-controller');
const userEditControllers2 = require('../controllers/user-edit-controller');

router.get('/session', userControllers2.sessionController);
router.post('/getInfo', userEditControllers2.getInfo);
router.post('/update', userEditControllers2.changeInfo);

// utility
router.post('/block', userEditControllers2.blockUser);
router.post('/getBlockedUsers', userEditControllers2.getBlockedUsers);
router.post('/removeBlockedUser', userEditControllers2.removeBlockedUser);
router.post('/add', userEditControllers2.addUser);

// get users
router.post('/getUsers', userEditControllers2.getUsers);
 
router.post('/join', userControllers2.joinController);
router.post('/login', userControllers2.loginController);
router.post('/changePicture', userEditControllers2.changePicture);

   
module.exports = router;
