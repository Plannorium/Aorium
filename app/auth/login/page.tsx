"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff, LogIn } from "lucide-react";

const LoginPage = () => {
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
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        const data = await res.json();
        // Store the token (e.g., in localStorage)
        localStorage.setItem("token", data.token);
        router.push("/dashboard");
      } else {
        const errorData = await res.json();
        setError(errorData.error || "Login failed. Please try again.");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-8.5rem)] flex items-center justify-center bg-[#071a3a] p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-slate-900/30 backdrop-blur-lg border border-slate-700/50 rounded-2xl shadow-2xl shadow-black/20 overflow-hidden">
          <div className="p-8 md:p-12">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-neutral-light tracking-tighter">
                Welcome Back
              </h1>
              <p className="text-neutral-light/70 mt-2">
                Sign in to access your Aorium dashboard.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
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
                  className="mt-1 block w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-neutral-light placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-all"
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
                    className="block w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-neutral-light placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-all"
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
                  className="w-full flex items-center justify-center bg-[#D4AF37] text-[#0A1833] font-semibold rounded-lg px-4 py-3 disabled:bg-[#b38f2c] disabled:cursor-not-allowed transition-all duration-300 hover:bg-[#FFD700] hover:shadow-lg hover:shadow-[#d4af37]/20"
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
                      <LogIn size={20} className="mr-2" />
                      Sign In
                    </>
                  )}
                </motion.button>
              </div>
            </form>

            <div className="text-center mt-8">
              <p className="text-sm text-slate-500">
                Don&apos;t have an account?{" "}
                <a
                  href="/auth/register"
                  className="font-medium text-[#D4AF37] hover:text-[#FFD700]"
                >
                  Sign up
                </a>
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
