import { authConfig } from "@/server/auth/config";
import NextAuth from "next-auth";

import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);


export default auth((req) => {
  const { nextUrl } = req;
  const isAuthenticated = !!req.auth;

  if (!isAuthenticated) {
    return NextResponse.redirect(new URL("/", nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher:  ["/setting"],
};