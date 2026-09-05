import type { Metadata } from "next";
import { AuthTopBar } from "@/components/auth/auth-topbar";
import { LoginForm } from "@/components/auth/login-form";
import { AuthShowcase } from "@/components/marketing/auth-showcase";

export const metadata: Metadata = {
  title: "Log In",
  description: "Log in to your ScarExchange account.",
};

export default function LoginPage() {
  return (
    <div className="grid min-h-screen bg-background lg:grid-cols-2">
      <AuthShowcase />
      <div className="flex flex-col">
        <AuthTopBar />
        <div className="flex flex-1 items-center justify-center px-4 pb-12">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
