"use client";
import { useEffect } from "react";
import { UserProfile } from "@/components/user-profile";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";


export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") {
      return;
    }
    if (!session) {
      router.push("/login");
    }
  }, [session, status, router]);

  return session ? <UserProfile session={session} /> : <div>Loading...</div>;
}
