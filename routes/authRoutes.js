const { Router } = require('express');
const authController = require('../controllers/authController');

const router = Router();

router.get('/reset-password/:email/:id/:token', authController.resetPassword_get)
router.post('/reset-password/:email/:id/:token', authController.resetPassword_post)
router.get('/forget-password',authController.forgetPassword_get);
router.post('/forget-password',authController.forgetPassword_post);
router.get('/signup', authController.signup_get);
router.post('/signup', authController.signup_post);
router.get('/login', authController.login_get);
router.post('/login', authController.login_post);
router.get('/logout', authController.logout_get);

module.exports = router;