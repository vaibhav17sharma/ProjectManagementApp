import ProfileCard from "@/app/_components/ProfileCard";
import { auth } from "@/server/auth";
import { type User } from "@prisma/client";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/");
  }
  return (
    <div className="flex items-center justify-center">
      <div className="w-full max-w-7xl p-6 bg-white rounded-lg">
        <ProfileCard user={session.user as User} />
      </div>
    </div>
  );
};

