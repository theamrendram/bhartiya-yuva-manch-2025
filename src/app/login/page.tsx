"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";

export default function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const { data: session, status } = useSession();
  const router = useRouter();
  const { theme } = useTheme();

  useEffect(() => {
    if (status === "loading") return;
    if (session) router.push("/profile");
  }, [session, status, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password");
      } else if (result?.ok) {
        router.push("/profile");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong!");
    }

    setIsLoading(false);
  };

  return (
    <div
      className={`min-h-screen flex items-center pt-16 md:pt-24 justify-center bg-gradient-to-br from-black via-zinc-900 to-black px-4`}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md"
      >
        <Card className="border border-zinc-700 bg-black/30 backdrop-blur-xl shadow-xl">
          <CardHeader className="text-center space-y-2">
            <CardTitle className="text-3xl font-extrabold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Sign in to Summer School
            </CardTitle>
            <p className="text-sm text-zinc-300">Access your dashboard</p>
          </CardHeader>

          <CardContent className="space-y-4">
            {error && (
              <Alert
                variant="destructive"
                className="bg-red-800/30 text-red-300 border-red-700"
              >
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email" className="text-white">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 bg-zinc-800 text-white border-zinc-700"
                  placeholder="you@example.com"
                  disabled={isLoading}
                />
              </div>

              <div>
                <Label htmlFor="password" className="text-white">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-1 bg-zinc-800 text-white border-zinc-700 pr-10"
                    placeholder="••••••••"
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="absolute right-2 top-2 h-8 w-8 text-zinc-400 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </Button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 text-white font-bold hover:brightness-110"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Signing in...
                  </span>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>

            <div className="text-center text-sm text-zinc-400 pt-4">
              Need help? <a href="#" className="underline text-blue-400">Contact support</a>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
