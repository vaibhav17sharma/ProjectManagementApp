import bcrypt from "bcryptjs";
import { type JWTPayload, SignJWT, importJWK } from "jose";
import { type NextAuthConfig } from "next-auth";
import { type JWT } from 'next-auth/jwt';
import CredentialsProvider from "next-auth/providers/credentials";

import { db } from "@/server/db";
export interface SessionUser {
  id: string;
  jwtToken: string;
  role: string;
  email: string;
  emailVerified: Date | null;
  name: string;
  image: string;
}

interface Token extends JWT {
  uid: string;
  jwtToken: string;
  role: string;
}

interface User extends SessionUser {
  id: string;
  name: string;
  email: string;
  role: string;
  token: string;
  image: string;
}

const generateJWT = async (payload: JWTPayload) => {
  const secret = process.env.AUTH_SECRET;
  const jwk = await importJWK({ k: secret, alg: "HS256", kty: "oct" });

  const jwt = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(jwk);

  return jwt;
};

export const authConfig: NextAuthConfig = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "email", type: "text" },
        password: { label: "password", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (process.env.LOCAL_CMS_PROVIDER) {
            return {
              id: "1",
              name: "test",
              email: "test@gmail.com",
              token: await generateJWT({ id: "1" }),
              role: 'ADMIN',
              image: "https://i.pravatar.cc/150?img=1",
            };
          }
          if (!credentials.username || !credentials.password) return null;
          const userDb = await db.user.findFirst({
            where: { email: credentials.username },
            select: { password: true, id: true, name: true, email: true, image: true ,role: true},
          });

          if (userDb?.password) {
            const valid = await bcrypt.compare(credentials.password as string, userDb.password);
            if (!valid) return null;

            const jwt = await generateJWT({ id: userDb.id });

            await db.$transaction(async (prisma) => {
              await prisma.user.update({
                where: { id: userDb.id },
                data: { token: jwt },
              });

              await prisma.session.create({
                data: {
                  sessionToken: jwt,
                  userId: userDb.id,
                  expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                },
              });
            });
            return {
              id: userDb.id,
              name: userDb.name,
              role: userDb.role,
              email: userDb.email,
              token: jwt,
              image: userDb.image ?? '',
            };
          }
        } catch (e) {
          console.error(e);
        }
        return null;
      },
    }),
  ],
  secret: process.env.AUTH_SECRET,
  callbacks: {
    async session({ session, token }) {
      if (session.user && (token as Token).uid) {
        const updatedUser: SessionUser = {
          ...session.user,
          id: (token as Token).uid,
          email: session.user?.email,
          name: session.user?.name ?? '',
          image: session.user?.image ?? '',
          jwtToken: (token as Token).jwtToken,
          role: (token as Token).role,
        };
        session.user = updatedUser;
      } 
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        (token as Token).uid = user.id ?? '';
        (token as Token).jwtToken = (user as User).token;
        (token as Token).role = (user as User).role;
      }
      return token;
    },
  },  
  pages: {
    signIn: "/signin",
  },
  session: {
    strategy: "jwt",
  },
  trustHost: true,
} satisfies NextAuthConfig;
