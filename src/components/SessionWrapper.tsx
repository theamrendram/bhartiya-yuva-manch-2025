"use client"; // Mark this file as a client component

import { SessionProvider, useSession } from "next-auth/react";
import { ReactNode } from "react";

const SessionComp = ({ children }: { children: ReactNode }) => {
  const { data: session } = useSession(); // Get the session using useSession

  return <>{children}</>;
};


const SessionWrapper = ({ children }: { children: ReactNode }) => {
  return (
    <SessionProvider>
      <SessionComp>{children}</SessionComp>
    </SessionProvider>
  );
};

export default SessionWrapper;
