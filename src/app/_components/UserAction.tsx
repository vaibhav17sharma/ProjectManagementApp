"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { type Session } from "next-auth";
import { signIn, signOut } from "next-auth/react";
import Link from "next/link";

export default function UserAction({
  session,
}: {
  session: Session;
}) {
  return (
    <>
      {session.user ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon" className="rounded-full">
              <Avatar className="h-9 w-9 sm:flex">
                <AvatarImage width={40} height={40} src={`${session.user.image}`} alt={session.user.name ?? ''} referrerPolicy={'no-referrer'}/>
                <AvatarFallback>
                  {session.user?.name?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <span className="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>{session?.user?.name}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link href={"/profile"}>Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <button onClick={() => signOut()}>Logout</button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <div className="ml-auto">
          <Button onClick={() => signIn()}>Sign in</Button>
        </div>
      )}
    </>
  );
}
