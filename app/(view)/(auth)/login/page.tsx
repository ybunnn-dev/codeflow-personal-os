import type { Metadata } from "next";
import LoginForm from "./partials/login_form";

export const metadata: Metadata = {
  title: "Login | CodeFlow",
  description: "Sign in to your CodeFlow account",
};

export default function LoginPage() {
  return (
    <main>
      <LoginForm />
    </main>
  );
}