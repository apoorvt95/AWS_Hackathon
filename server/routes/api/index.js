import express from 'express';
import users_controller from '../../controllers/users.ctrl';

const router = express.Router();

// @route  GET api/users/currentuser
// @desc   Get all users
// @access Public

router.get('/currentuser', users_controller.getCurrentUser);

// @route  POST api/users
// @desc   Create new user
// @access Public

router.post('/register', users_controller.registerUser);

// @route  DELETE api/users
// @desc   Delete user
// @access Public

router.delete('/:id', users_controller.deleteUser);

// @route  PUT api/users/login
// @desc   Validate user login
// @access Public

router.post('/login', users_controller.authenticateUser);

export default router;