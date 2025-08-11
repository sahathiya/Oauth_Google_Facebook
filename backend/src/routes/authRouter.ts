import express from 'express'
import { facebookLogin, googleLogin, simpleGoogleLogin } from '../controllers/authController'

export const authRouter=express.Router()


authRouter
.get('/google',googleLogin)

.post('/facebook-login',facebookLogin)


.post('/google',simpleGoogleLogin)

