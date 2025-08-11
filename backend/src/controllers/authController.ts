// import { Request, Response } from "express";
// import { User } from "../models/userSchema";
// import { oauth2client } from "../config/googleConfig";
// import axios from 'axios'
// import jwt from 'jsonwebtoken'
// export const googleLogin=async(req:Request,res:Response)=>{
// try {
//     const {code} =req.query;
//     const googleResponse=await oauth2client.getToken(code)
//    oauth2client.setCredentials(googleResponse.tokens)

//    const userRes=await axios.get(`https://www.googleapis.com/auth2/v1/userinfo?alt=json&access_token=${googleResponse.tokens.access_token}`)
//    const{email,name,picture}=userRes.data
// let user=await User.findOne({email})
// if(!user){
//     user=new User.create({
//         name,
//         email,
//         image:picture
//     })
// }
// const {_id}=user
// const token=jwt.sign({_id,email},process.env.JWT_SECRET,{expiresIn:process.env.JWT_TIMEOUT})

// return res.status(200).json({message:'success',token,User})
// } catch (error) {
//     return res.status(500).json({message:'internal server error'})
// }
// }


import { Request, Response } from "express";
import {User} from "../models/userSchema";
import { oauth2client } from "../config/googleConfig";
import axios from 'axios';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from "google-auth-library";

export const googleLogin = async (req: Request, res: Response) => {
  try {
    const { code } = req.query;
console.log("code...",code);

    if (!code) {
      return res.status(400).json({ message: 'Authorization code is required' });
    }

    // Exchange code for tokens
    const { tokens } = await oauth2client.getToken(code as string);

    console.log("tokens",tokens);
    
    oauth2client.setCredentials(tokens);

    // Fetch user info from Google
    const userRes = await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${tokens.access_token}`);
    const { email, name, picture } = userRes.data;

    if (!email) {
      return res.status(400).json({ message: 'Failed to retrieve user email' });
    }

    // Check if user exists
    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name,
        email,
        image: picture
      });
    }

    const { _id } = user;

    // JWT secret and timeout from env
    
    const secret = process.env.JWT_SECRET ;
    const timeout = process.env.JWT_TIMEOUT as string || '1d';

    if (!secret) {
      return res.status(500).json({ message: 'JWT_SECRET not defined in environment' });
    }

    const token = jwt.sign({ _id, email }, secret as string, { expiresIn: timeout });

    return res.status(200).json({
      message: 'success',
      token,
      user   
    });

  } catch (error) {
    console.error("Google Login Error:", error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};




export const facebookLogin=async(req:Request,res:Response)=>{


  try {
    const {userId,accessToken}=req.body

let urlGraphFacebook = `https://graph.facebook.com/v2.11/${userId}/?fields=id,name,picture,email&access_token=${accessToken}`

const response=await fetch(urlGraphFacebook)
const data=await response.json()

console.log("data from facebook login",data);

return res.status(200).json({success:true,data})
    
  } catch (error) {
    return res.status(500).json({success:false})
  }



}




export const simpleGoogleLogin=async(req:Request,res:Response)=>{
const { credential } = req.body;



console.log("credential from backend",credential);

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  if (!credential) return res.status(400).json({ error: 'Missing credential' });

  try {
    // ✅ VERIFY JWT FROM GOOGLE
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, picture, sub: googleId } = payload;

    // ✅ FIND OR CREATE USER IN DATABASE
    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({ email, name, avatar: picture, googleId });
    }

    // ✅ OPTIONAL: ISSUE YOUR OWN JWT TOKEN
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    // ✅ SEND BACK RESPONSE
    res.status(200).json({ message: 'User authenticated', user, token });
  } catch (err) {
    console.error('Token verification failed:', err);
    res.status(401).json({ error: 'Invalid token' });
  }
}