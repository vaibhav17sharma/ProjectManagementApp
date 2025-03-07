"use client";
import ProfileCard from "@/app/_components/ProfileCard";
import { useSession } from "next-auth/react";

export default function ProfilePage() {
  const { data: session } = useSession();

  return (
    <div className="flex items-center justify-center">
      <div className="w-full max-w-7xl p-6 bg-white rounded-lg">
        <ProfileCard
          initialName={session?.user?.name || ""}
          initialEmail={session?.user?.email || ""}
          initialImage={session?.user?.image || ""}
        />
      </div>
    </div>
  );
};

