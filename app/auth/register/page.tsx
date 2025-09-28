"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff, UserPlus } from "lucide-react";
import { signIn } from "next-auth/react";

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      if (res.ok) {
        router.push("/auth/login?registration=success");
      } else {
        const errorData = await res.json();
        setError(errorData.error || "Registration failed. Please try again.");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-7rem)] flex items-center justify-center bg-[#071a3a] p-3">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-slate-900/30 backdrop-blur-lg border border-slate-700/50 rounded-2xl shadow-2xl shadow-black/20 overflow-hidden">
          <div className="p-8 md:p-12">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-neutral-light tracking-tighter">
                Create an Account
              </h1>
              <p className="text-neutral-light/70 mt-2">
                Join Aorium and start your journey.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label
                  htmlFor="name"
                  className="text-sm font-medium text-neutral-light/80"
                >
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="mt-1 block w-full bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2 text-neutral-light placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-all"
                  placeholder="Your Name"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-neutral-light/80"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="mt-1 block w-full bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2 text-neutral-light placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-all"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-neutral-light/80"
                >
                  Password
                </label>
                <div className="relative mt-1">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="block w-full bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2 text-neutral-light placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-all"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 px-4 flex items-center text-slate-500 hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {error && (
                <p className="text-sm text-red-400 bg-red-500/10 p-3 rounded-lg text-center">
                  {error}
                </p>
              )}

              <div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center bg-[#D4AF37] text-[#0A1833] font-semibold rounded-lg px-3 py-2 disabled:bg-[#b38f2c] disabled:cursor-not-allowed transition-all duration-300 hover:bg-[#FFD700] hover:shadow-lg hover:shadow-[#d4af37]/20"
                >
                  {loading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        repeat: Infinity,
                        duration: 1,
                        ease: "linear",
                      }}
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                    />
                  ) : (
                    <>
                      <UserPlus size={20} className="mr-2" />
                      Sign Up
                    </>
                  )}
                </motion.button>
              </div>
            </form>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-700" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-slate-900/30 px-2 text-slate-500">
                  Or continue with
                </span>
              </div>
            </div>

            <div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
                className="w-full flex items-center justify-center bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2 text-neutral-light font-semibold hover:bg-slate-800 transition-all"
              >
                <svg
                  className="w-5 h-5 mr-3"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M21.35,11.1H12.18V13.83H18.69C18.36,17.64 15.19,19.27 12.19,19.27C8.36,19.27 5,16.25 5,12.5C5,8.75 8.36,5.73 12.19,5.73C15.19,5.73 17.5,6.73 18.69,8.14L21.35,5.62C19.27,3.5 16.36,2 12.19,2C6.42,2 2.03,6.8 2.03,12.5C2.03,18.2 6.42,23 12.19,23C17.96,23 21.54,18.81 21.54,12.81C21.54,12.19 21.45,11.61 21.35,11.1Z" />
                </svg>
                Sign up with Google
              </motion.button>
            </div>

            <div className="text-center mt-4">
              <p className="text-sm text-slate-500">
                Already have an account?{" "}
                <a
                  href="/auth/login"
                  className="font-medium text-[#D4AF37] hover:text-[#FFD700]"
                >
                  Sign in
                </a>
              </p>
            </div>
            <p className="text-xs text-neutral-light/60 text-center mt-8">
              By signing up, you agree to our{" "}
              <a href="/terms" className="text-[#D4AF37] hover:underline">
                Terms and Services
              </a>
              .
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
