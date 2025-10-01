import NextAuth, { CredentialsSignin } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import User from "@/models/user.model"
import bcrypt from "bcrypt" 
import connectDB from "@/lib/db"
class InvalidLoginError extends CredentialsSignin {
  code = "Invalid identifier or password"
}
 
export const { handlers, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await connectDB()
        const user = await User.findOne({ email: credentials?.email })
        if (!user) {
          throw new InvalidLoginError()
        }
        const isValid = await bcrypt.compare(credentials!.password as string, user.password)
        if (!isValid) {
          throw new InvalidLoginError()
        }
        return user
      },
    }),
    
  ],
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
   async session({ session, token }) {
  if (!session.user) session.user = {
    id: token.sub || '',
    email: token.email || '',
    emailVerified: null,
  } as any;
  if (token.sub) {
    session.user.id = token.sub;
  }
  return session;
}
  },
  debug: process.env.NODE_ENV === "development",
})