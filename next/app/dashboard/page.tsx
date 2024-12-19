import { getServerSession } from "next-auth";
import { GET as handler } from "@/app/api/auth/[...nextauth]/route"; // Adaptez selon votre chemin
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session: { user?: { email?: string } } | null = await getServerSession(handler);

  if (!session) {
    // Redirection si pas authentifié
    redirect("/login");
  }

  return <h1>Welcome to your dashboard, {session.user?.email}!</h1>;
}
