"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

const OtpVerifyPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!email) {
      setError("Email not found. Please register again.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/otp/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || "OTP verification failed.");
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/auth/login");
      }, 2000);
    } catch (err) {
      console.error("OTP_VERIFY_ERROR:", err);
      setError("An unexpected error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-8.5rem)] flex items-center justify-center bg-[#071a3a] p-3">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-slate-900/30 backdrop-blur-lg border border-slate-700/50 rounded-2xl shadow-2xl shadow-black/20 overflow-hidden">
          <div className="p-8 md:p-12">
            <div className="text-center mb-8">
              <h1
                className="text-4xl font-bold tracking-tighter"
                style={{ color: "#F5F5F5" }}
              >
                Verify Your Email
              </h1>
              <p className="mt-2" style={{ color: "#F5F5F5B3" }}>
                An OTP code has been sent to <strong>{email}</strong>. Please
                enter it below to verify your account.
              </p>
            </div>

            {success ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="text-center text-green-400"
              >
                <CheckCircle2 size={48} className="mx-auto mb-4" />
                <p className="text-lg font-semibold">
                  Email verified successfully!
                </p>
                <p className="text-sm">Redirecting to login...</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="otp"
                    className="text-sm font-medium text-neutral-light/80"
                  >
                    OTP
                  </label>
                  <input
                    id="otp"
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                    maxLength={6}
                    className="mt-1 block w-full bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2 text-neutral-light placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-all text-center text-xl tracking-widest"
                    placeholder="_ _ _ _ _ _"
                  />
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
                        <CheckCircle2 size={20} className="mr-2" />
                        Verify OTP
                      </>
                    )}
                  </motion.button>
                </div>
              </form>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default OtpVerifyPage;
