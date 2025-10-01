"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { User } from "@/types/user";
import { UserDashboard } from "@/components/admin/user-dashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Shield, Users } from "lucide-react";

export default function AdminDashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === "loading") {
      return;
    }
    
    if (!session) {
      router.push("/login");
      return;
    }

    // Check if user is admin
    const checkAdminAccess = async () => {
      try {
        const response = await fetch("/api/admin/users");
        if (response.status === 403) {
          router.push("/profile");
          return;
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Error checking admin access:", error);
        router.push("/profile");
      }
    };

    checkAdminAccess();
  }, [session, status, router]);

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Admin Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Manage user registrations and system data
              </p>
            </div>
          </div>
        </div>

        <UserDashboard />
      </div>
    </div>
  );
} 