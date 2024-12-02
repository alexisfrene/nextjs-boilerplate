import { getRolesByToken } from "@/lib";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        userName: { label: "userName", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/login`,
          {
            method: "POST",
            body: JSON.stringify({
              userName: credentials?.userName,
              password: credentials?.password,
            }),
            headers: { "Content-Type": "application/json" },
          }
        );
        let user = await res.json();
        if (user.error) throw user;

        if (user.statusCode !== 200) {
          throw new Error(user.message);
        }
        user = {
          token: user.response.token,
        };
        const roles = await getRolesByToken(user.token);
        if (roles.length === 0) throw new Error("Usuario no tiene Roles");
        // Verificar si solo existe el rol De operador
        if (roles.length === 1 && roles[0] === process.env.OPERATOR_ROLE)
          throw new Error("Usuario no tiene acceso a la plataforma");

        return user;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      return { ...token, ...user };
    },
    async session({ session, token }) {
      session.user = token as any;
      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
    signOut: "/auth/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
