   
   "use client"
   
   import { GoogleOAuthProvider } from '@react-oauth/google';
import React, { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

function GoogleProvider({ children }: Props) {
  const clientId= process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID

  console.log("clientId from provider",clientId);
  
  if (!clientId) {
    throw new Error("GOOGLE_CLIENT_ID is not defined");
  }
  return (
    <GoogleOAuthProvider clientId={clientId}>
      {children}
    </GoogleOAuthProvider>
  );
}

export default GoogleProvider;
