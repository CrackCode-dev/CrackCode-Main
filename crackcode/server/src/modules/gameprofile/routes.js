import express from 'express';
import userAuth from '../auth/middleware.js';
import { UpdateGameProfile,checkUsername,getCurrentUser } from './controller.js';

const gameProfileRouter = express.Router();

//Update game profile(avater+ username)
gameProfileRouter.put('/update', userAuth,UpdateGameProfile);

//Check username availability
gameProfileRouter.get('/check-username/:username',userAuth,checkUsername);

//Get current user data
gameProfileRouter.get('/currentUser',userAuth,getCurrentUser);

export default gameProfileRouter;