"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  User,
  Users,
} from "lucide-react";

import { useAuth } from "@/context/AuthContext";

type Role = "citizen" | "authority";

export default function SignupPage() {
  const router = useRouter();
  const { signup } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [role, setRole] = useState<Role>("citizen");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setError("");

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPhone = phone.trim();

    if (!cleanName) {
      setError("Please enter your full name");
      return;
    }

    if (!cleanEmail) {
      setError("Please enter your email address");
      return;
    }

    if (!password) {
      setError("Please enter a password");
      return;
    }

    if (password.length < 6) {
      setError("Password must contain at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      await signup(
        cleanName,
        cleanEmail,
        password,
        cleanPhone || undefined,
        role
      );

      // Successful signup → Home page
      router.push("/");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to create account"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f6faf8] text-[#10201c]">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-[420px] w-[420px] rounded-full bg-emerald-200/30 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 h-[420px] w-[420px] rounded-full bg-cyan-200/20 blur-3xl" />
      </div>

      {/* Top bar */}
      <header className="relative z-10 border-b border-slate-200/70 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex h-[70px] max-w-[1200px] items-center justify-between px-5 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="group flex items-center gap-2.5"
          >
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/20 transition group-hover:scale-105">
              <MapPin size={19} strokeWidth={2.5} />
            </span>

            <div>
              <p className="text-lg font-black tracking-tight">
                Civic<span className="text-emerald-600">Fix</span>
              </p>

              <p className="hidden text-[8px] font-bold uppercase tracking-[0.16em] text-slate-400 sm:block">
                Report · Track · Resolve
              </p>
            </div>
          </Link>

          <Link
            href="/login"
            className="flex items-center gap-2 text-sm font-bold text-slate-600 transition hover:text-emerald-700"
          >
            Already have an account?
            <span className="text-emerald-700">
              Login
            </span>
          </Link>
        </div>
      </header>

      {/* Main */}
      <section className="relative z-10 px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
        <div className="mx-auto grid max-w-[1050px] overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_30px_100px_-40px_rgba(15,23,42,0.3)] lg:grid-cols-[0.85fr_1.15fr]">
          {/* Left panel */}
          <div className="relative hidden overflow-hidden bg-[#10201c] p-10 text-white lg:block">
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-emerald-500/20 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-teal-500/10 blur-3xl" />

            <div className="relative flex h-full flex-col">
              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-[10px] font-black tracking-[0.15em] text-emerald-300">
                <ShieldCheck size={12} />
                CIVIC INTELLIGENCE
              </div>

              <h1 className="mt-8 text-4xl font-black leading-tight tracking-[-0.05em]">
                Make your city
                <br />
                <span className="text-emerald-400">
                  better together.
                </span>
              </h1>

              <p className="mt-5 max-w-sm text-sm leading-7 text-slate-400">
                Create your CivicFix account to report civic
                problems, follow their progress, and help
                authorities build better communities.
              </p>

              <div className="mt-10 space-y-4">
                <Feature
                  icon={MapPin}
                  title="Report local problems"
                  description="Submit issues with location and evidence."
                />

                <Feature
                  icon={Users}
                  title="Community visibility"
                  description="See what is happening around your city."
                />

                <Feature
                  icon={CheckCircle2}
                  title="Track resolution"
                  description="Follow every issue from report to resolution."
                />
              </div>

              <div className="mt-auto pt-12">
                <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500">
                  CivicFix Platform
                </p>

                <p className="mt-2 text-xs text-slate-500">
                  Evidence · Intelligence · Action
                </p>
              </div>
            </div>
          </div>

          {/* Signup form */}
          <div className="p-5 sm:p-8 lg:p-10">
            <div className="mx-auto max-w-[520px]">
              <Link
                href="/"
                className="mb-6 inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 transition hover:text-emerald-700"
              >
                <ArrowLeft size={14} />
                Back to home
              </Link>

              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-emerald-600">
                  Create account
                </p>

                <h2 className="mt-2 text-3xl font-black tracking-[-0.045em] text-slate-900">
                  Join CivicFix
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Choose your account type and create your
                  CivicFix account.
                </p>
              </div>

              {/* Error */}
              {error && (
                <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                  {error}
                </div>
              )}

              <form
                onSubmit={handleSubmit}
                className="mt-7 space-y-5"
              >
                {/* Role */}
                <div>
                  <label className="mb-2.5 block text-xs font-black uppercase tracking-wide text-slate-700">
                    Account type
                  </label>

                  <div className="grid grid-cols-2 gap-3">
                    {/* Citizen */}
                    <button
                      type="button"
                      onClick={() => setRole("citizen")}
                      className={`group rounded-2xl border p-4 text-left transition-all ${
                        role === "citizen"
                          ? "border-emerald-500 bg-emerald-50 ring-2 ring-emerald-100"
                          : "border-slate-200 bg-white hover:border-emerald-300 hover:bg-slate-50"
                      }`}
                    >
                      <div
                        className={`mb-3 grid h-10 w-10 place-items-center rounded-xl ${
                          role === "citizen"
                            ? "bg-emerald-500 text-white"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        <User size={19} />
                      </div>

                      <p className="text-sm font-black text-slate-900">
                        Citizen
                      </p>

                      <p className="mt-1 text-[11px] leading-5 text-slate-500">
                        Report and track civic issues.
                      </p>

                      {role === "citizen" && (
                        <div className="mt-3 flex items-center gap-1 text-[10px] font-black text-emerald-600">
                          <CheckCircle2 size={13} />
                          Selected
                        </div>
                      )}
                    </button>

                    {/* Authority */}
                    <button
                      type="button"
                      onClick={() => setRole("authority")}
                      className={`group rounded-2xl border p-4 text-left transition-all ${
                        role === "authority"
                          ? "border-blue-500 bg-blue-50 ring-2 ring-blue-100"
                          : "border-slate-200 bg-white hover:border-blue-300 hover:bg-slate-50"
                      }`}
                    >
                      <div
                        className={`mb-3 grid h-10 w-10 place-items-center rounded-xl ${
                          role === "authority"
                            ? "bg-blue-600 text-white"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        <ShieldCheck size={19} />
                      </div>

                      <p className="text-sm font-black text-slate-900">
                        Authority
                      </p>

                      <p className="mt-1 text-[11px] leading-5 text-slate-500">
                        Manage and resolve civic issues.
                      </p>

                      {role === "authority" && (
                        <div className="mt-3 flex items-center gap-1 text-[10px] font-black text-blue-600">
                          <CheckCircle2 size={13} />
                          Selected
                        </div>
                      )}
                    </button>
                  </div>

                  {role === "authority" && (
                    <p className="mt-2 text-[10px] leading-4 text-slate-400">
                      Authority accounts should be verified before
                      being given access to official management
                      features.
                    </p>
                  )}
                </div>

                {/* Name */}
                <InputField
                  label="Full name"
                  icon={User}
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={setName}
                  required
                />

                {/* Email */}
                <InputField
                  label="Email address"
                  icon={Mail}
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={setEmail}
                  required
                />

                {/* Phone */}
                <InputField
                  label="Phone number"
                  icon={Phone}
                  type="tel"
                  placeholder="Optional"
                  value={phone}
                  onChange={setPhone}
                />

                {/* Password */}
                <div>
                  <label className="mb-2 block text-xs font-black text-slate-700">
                    Password
                  </label>

                  <div className="relative">
                    <Lock
                      size={17}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                      value={password}
                      onChange={(e) =>
                        setPassword(e.target.value)
                      }
                      placeholder="Minimum 6 characters"
                      required
                      className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-11 text-sm font-medium outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(!showPassword)
                      }
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                    >
                      {showPassword ? (
                        <EyeOff size={17} />
                      ) : (
                        <Eye size={17} />
                      )}
                    </button>
                  </div>
                </div>

                {/* Confirm password */}
                <div>
                  <label className="mb-2 block text-xs font-black text-slate-700">
                    Confirm password
                  </label>

                  <div className="relative">
                    <Lock
                      size={17}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      type={
                        showConfirmPassword
                          ? "text"
                          : "password"
                      }
                      value={confirmPassword}
                      onChange={(e) =>
                        setConfirmPassword(e.target.value)
                      }
                      placeholder="Enter password again"
                      required
                      className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-11 text-sm font-medium outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(
                          !showConfirmPassword
                        )
                      }
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={17} />
                      ) : (
                        <Eye size={17} />
                      )}
                    </button>
                  </div>
                </div>

                {/* Terms */}
                <div className="flex items-start gap-2.5">
                  <input
                    id="terms"
                    type="checkbox"
                    required
                    className="mt-0.5 h-4 w-4 rounded border-slate-300 accent-emerald-600"
                  />

                  <label
                    htmlFor="terms"
                    className="text-[11px] leading-5 text-slate-500"
                  >
                    I agree to use CivicFix responsibly and provide
                    accurate information when reporting civic
                    issues.
                  </label>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#123d34] text-sm font-black text-white shadow-lg shadow-emerald-900/10 transition hover:-translate-y-0.5 hover:bg-[#0d3029] hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
                >
                  {loading ? (
                    <>
                      <Loader2
                        size={17}
                        className="animate-spin"
                      />
                      Creating account...
                    </>
                  ) : (
                    <>
                      Create {role === "authority"
                        ? "Authority"
                        : "Citizen"}{" "}
                      Account
                      <ArrowRight
                        size={17}
                        className="transition-transform group-hover:translate-x-1"
                      />
                    </>
                  )}
                </button>
              </form>

              <p className="mt-6 text-center text-xs text-slate-500">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-black text-emerald-700 hover:text-emerald-800"
                >
                  Login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

/* ============================================================
   FEATURE COMPONENT
============================================================ */

function Feature({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof MapPin;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-3">
      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/10 text-emerald-300">
        <Icon size={18} />
      </div>

      <div>
        <p className="text-sm font-black">
          {title}
        </p>

        <p className="mt-1 text-xs leading-5 text-slate-400">
          {description}
        </p>
      </div>
    </div>
  );
}

/* ============================================================
   INPUT COMPONENT
============================================================ */

function InputField({
  label,
  icon: Icon,
  type,
  placeholder,
  value,
  onChange,
  required = false,
}: {
  label: string;
  icon: typeof User;
  type: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-2 block text-xs font-black text-slate-700">
        {label}
      </label>

      <div className="relative">
        <Icon
          size={17}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm font-medium outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
        />
      </div>
    </div>
  );
}