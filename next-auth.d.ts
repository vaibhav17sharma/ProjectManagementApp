import "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    email: string;
    name: string;
    image: string;         
    jwtToken: string;
    role: string;
  }

  interface Session {
    user: User;
  }
}
