import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu, Package2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { auth } from "@/server/auth";
import { type SessionUser } from "@/server/auth/config";
import Link from "next/link";
import { redirect } from "next/navigation";
import UserAction from "./UserAction";
export const Appbar = async () => {
  const session = await auth();

  if (!session?.user) {
    redirect("/");
  }
  const user = session?.user as SessionUser;
  return (
    <>
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
          <Link
            href="/"
            className="flex w-96 items-center gap-2 text-lg font-semibold md:text-base"
          >
            <span className="text-2xl font-bold">Project Management App</span>
          </Link>
        </nav>
        <Sheet>
          <SheetTitle className="sr-only">Menu</SheetTitle>
          <SheetDescription className="sr-only">Description</SheetDescription>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="shrink-0 md:hidden"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <nav className="grid gap-6 text-lg font-medium">
              <Link
                href="/dashboard"
                className="flex items-center gap-2 text-lg font-semibold"
              >
                <Package2 className="h-6 w-6" />
                <span className="sr-only">Project Management App</span>
              </Link>
              <Link href="/dashboard" className="hover:text-foreground">
                Dashboard
              </Link>
            </nav>
          </SheetContent>
        </Sheet>
        <div className="flex w-full flex-row-reverse items-center gap-4 md:gap-2 lg:gap-4">
          <UserAction session={session} />
          <Badge variant="outline">{user.role}</Badge>
        </div>
      </header>
    </>
  );
};
