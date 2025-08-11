import { api } from "./api"

export const getGoogleAuth=async(code:string)=>{
    console.log("etered here");
    
    const response=await api.get(`/auth/google?code=${code}`)

    console.log("response....",response);
    
return response
}