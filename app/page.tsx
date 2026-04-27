import { redirect } from "next/navigation";
import { auth } from "@/auth"; // adjust path based on your setup

export default async function Home() {
  const session = await auth();

  if (session) {
    redirect("/homepage");
  } else {
    redirect("/login");
  }
}