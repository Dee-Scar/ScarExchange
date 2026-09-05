"use client";

import { useState } from "react";
import Link from "next/link";
import { Lock, Mail, Phone } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { AuthField, AuthPasswordField } from "@/components/auth/auth-field";
import { SocialAuth } from "@/components/auth/social-auth";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

type LoginMethod = "email" | "phone";

export function LoginForm() {
  const [method, setMethod] = useState<LoginMethod>("email");
  const [remember, setRemember] = useState(true);

  return (
    <div className="w-full max-w-[420px] rounded-3xl border border-hairline bg-card p-8 shadow-card">
      <div className="flex justify-center">
        <Logo height={44} />
      </div>

      <h1 className="mt-6 text-[24px] font-bold text-neutral-900 dark:text-white">
        Welcome back! 👋
      </h1>
      <p className="mt-1 text-[13.5px] text-neutral-500 dark:text-neutral-400">
        Log in to your ScarExchange account
      </p>

      <Tabs
        value={method}
        onValueChange={(value) => setMethod(value as LoginMethod)}
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

        <div>
          <div className="flex items-center justify-between">
            <label className="text-[13px] font-semibold text-neutral-700 dark:text-neutral-200">
              Password
            </label>
            <Link
              href="/forgot-password"
              className="text-[12.5px] font-medium text-brand-600 transition-colors hover:text-brand-700 dark:text-brand-300"
            >
              Forgot password?
            </Link>
          </div>
          <AuthPasswordField
            label=""
            icon={Lock}
            placeholder="Enter your password"
            autoComplete="current-password"
            aria-label="Password"
          />
        </div>

        <label className="flex cursor-pointer items-center gap-2 text-[13px] text-neutral-600 dark:text-neutral-300">
          <Checkbox checked={remember} onCheckedChange={(checked) => setRemember(checked === true)} />
          Remember me
        </label>

        <Button type="submit" className="h-12 w-full rounded-xl text-[14px]">
          Log In
        </Button>
      </form>

      <SocialAuth />

      <p className="mt-6 text-center text-[13px] text-neutral-500 dark:text-neutral-400">
        Don&apos;t have an account?{" "}
        <Link
          href="/signup"
          className="font-semibold text-brand-600 transition-colors hover:text-brand-700 dark:text-brand-300"
        >
          Sign up
        </Link>
      </p>
    </div>
  );
}
