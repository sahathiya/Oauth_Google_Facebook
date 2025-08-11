"use client"
import { useRouter } from "next/navigation";
import { GoogleLogin } from "@react-oauth/google";
import { googleLogout } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
export default function Home() {
  const router=useRouter()

 
  return (
    <div>
      <h1 className="text-2xl text-blue-800 text-center p-10 font-bold"> LANDING PAGE</h1>

 <div className="flex justify-center">
       <button
  onClick={()=>router.push('/auth/login')}
  className="bg-blue-500 hover:bg-blue-900 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300"
>
  Login
</button>
 </div>

     
{/* <GoogleLogin 
onSuccess={(credentialResponse)=>{
  console.log("credentialResponse",credentialResponse);
  
  console.log("jwtDecode",jwtDecode(credentialResponse?.credential));
  router.push('/home')
  
}} 

onError={()=>{
  console.log("loin failed");
  
}}
useOneTap
auto_select={true}
/> */}
    </div>
  );
}
