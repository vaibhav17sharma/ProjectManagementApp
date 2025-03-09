import { Button } from "@/components/ui/button";
import { auth } from "@/server/auth";
import { HydrateClient } from "@/trpc/server";
import Image from "next/image";
import Link from "next/link";

export default async function Home() {
  const session = await auth();

  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center justify-center">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
          <h1 className="text-5xl font-extrabold tracking-tight">
            Project Management App
          </h1>
          {session && (
            <>
              <Image
                className="rounded-full shadow-xl"
                src={session.user?.image ?? ""}
                alt="User Avatar"
                width={50}
                height={50}
              />
              <div>Hi {session.user?.name}, Welcome to the app</div>
            </>
          )}
          <div className="flex gap-2">
          {session && (
            <Button variant={"outline"} asChild>
              <Link href={"/dashboard"}>Dashboard</Link>
            </Button>
          )}
          <Button variant="default" asChild>
            <Link href={session ? "/api/auth/signout" : "/api/auth/signin"}>
              {session ? "Sign out" : "Sign in"}
            </Link>
          </Button>
          </div>
        </div>
      </main>
    </HydrateClient>
  );
}
