"use client";

import { useState } from "react";
import Link from "next/link";
import { Lock, Mail, Phone, User } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { AuthField, AuthPasswordField } from "@/components/auth/auth-field";
import { SocialAuth } from "@/components/auth/social-auth";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

type SignupMethod = "email" | "phone";

export function SignupForm() {
  const [method, setMethod] = useState<SignupMethod>("email");
  const [agreed, setAgreed] = useState(true);

  return (
    <div className="w-full max-w-[420px] rounded-3xl border border-hairline bg-card p-8 shadow-card">
      <div className="flex justify-center">
        <Logo height={44} />
      </div>

      <h1 className="mt-6 text-[24px] font-bold text-neutral-900 dark:text-white">
        Create your account 🚀
      </h1>
      <p className="mt-1 text-[13.5px] text-neutral-500 dark:text-neutral-400">
        Join ScarExchange and start trading
      </p>

      <Tabs
        value={method}
        onValueChange={(value) => setMethod(value as SignupMethod)}
        className="mt-6"
      >
        <TabsList variant="line" className="h-auto w-full justify-start gap-6 border-b border-hairline p-0">
          <TabsTrigger value="email" className="h-auto flex-none px-0 pb-2.5 text-[13.5px]">
            Email
          </TabsTrigger>
          <TabsTrigger value="phone" className="h-auto flex-none px-0 pb-2.5 text-[13.5px]">
            Phone Number
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <form
        className="mt-6 space-y-4"
        onSubmit={(e) => {
          // No backend yet — this screen is presentational (see PRD-phase note).
          e.preventDefault();
        }}
      >
        <AuthField
          label="Full Name"
          icon={User}
          type="text"
          placeholder="Enter your full name"
          autoComplete="name"
        />

        {method === "email" ? (
          <AuthField
            label="Email Address"
            icon={Mail}
            type="email"
            placeholder="Enter your email"
            autoComplete="email"
          />
        ) : (
          <AuthField
            label="Phone Number"
            icon={Phone}
            type="tel"
            placeholder="Enter your phone number"
            autoComplete="tel"
          />
        )}

        <AuthPasswordField
          label="Password"
          icon={Lock}
          placeholder="Create a password"
          autoComplete="new-password"
        />

        <AuthPasswordField
          label="Confirm Password"
          icon={Lock}
          placeholder="Confirm your password"
          autoComplete="new-password"
        />

        <label className="flex cursor-pointer items-start gap-2 text-[12.5px] leading-relaxed text-neutral-600 dark:text-neutral-300">
          <Checkbox
            checked={agreed}
            onCheckedChange={(checked) => setAgreed(checked === true)}
            className="mt-0.5"
          />
          <span>
            I agree to the{" "}
            <Link
              href="/legal/terms"
              className="font-semibold text-brand-600 transition-colors hover:text-brand-700 dark:text-brand-300"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              href="/legal/privacy"
              className="font-semibold text-brand-600 transition-colors hover:text-brand-700 dark:text-brand-300"
            >
              Privacy Policy
            </Link>
          </span>
        </label>

        <Button type="submit" disabled={!agreed} className="h-12 w-full rounded-xl text-[14px]">
          Sign Up
        </Button>
      </form>

      <SocialAuth />

      <p className="mt-6 text-center text-[13px] text-neutral-500 dark:text-neutral-400">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-semibold text-brand-600 transition-colors hover:text-brand-700 dark:text-brand-300"
        >
          Log in
        </Link>
      </p>
    </div>
  );
}
