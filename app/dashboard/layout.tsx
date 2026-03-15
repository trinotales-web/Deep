import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { Navigation } from "@/components/layout/Navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/auth/login");
  }

  return (
    <div className="min-h-screen bg-[#f6f3ee]">
      <Navigation />
      {/* Desktop: offset for sidebar */}
      <div className="md:ml-64">
        <main className="max-w-[480px] md:max-w-2xl mx-auto px-4 py-6 pb-28 md:pb-8">
          {children}
        </main>
      </div>
    </div>
  );
}
