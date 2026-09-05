import type { Metadata } from "next";
import { AuthTopBar } from "@/components/auth/auth-topbar";
import { SignupForm } from "@/components/auth/signup-form";
import { AuthShowcase } from "@/components/marketing/auth-showcase";

export const metadata: Metadata = {
  title: "Sign Up",
  description: "Create your ScarExchange account.",
};

export default function SignupPage() {
  return (
    <div className="grid min-h-screen bg-background lg:grid-cols-2">
      <AuthShowcase />
      <div className="flex flex-col">
        <AuthTopBar />
        <div className="flex flex-1 items-center justify-center px-4 pb-12">
          <SignupForm />
        </div>
      </div>
    </div>
  );
}
