import { Appbar } from "@/app/_components/AppBar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Appbar />
      <div className="mt-10 max-w-screen-xl mx-auto">{children}</div>
    </div>
  );
}
