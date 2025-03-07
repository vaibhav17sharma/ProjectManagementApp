import bcrypt from "bcryptjs";
import { JWTPayload, SignJWT, importJWK } from "jose";
import { NextAuthConfig } from "next-auth";
import { JWT } from 'next-auth/jwt';
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
}

interface User {
  id: string;
  name: string;
  email: string | null;
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
            select: { password: true, id: true, name: true, role: true, email: true, image: true },
          });

          if (userDb && userDb.password) {
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
                  expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 year
                },
              });
            });

            return {
              id: userDb.id,
              name: userDb.name,
              role: userDb.role || 'EMPLOYEE',
              email: userDb.email,
              token: jwt,
              image: userDb.image as string,
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
          name: session.user?.name as string,
          image: session.user?.image as string,
          jwtToken: (token as Token).jwtToken,
          role: process.env.ADMINS?.split(',').includes(session.user?.email ?? '') ? 'ADMIN' : 'EMPLOYEE',
        };
        session.user = updatedUser;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        (token as Token).uid = user.id as string;
        (token as Token).jwtToken = (user as User).token;
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
} satisfies NextAuthConfig;
