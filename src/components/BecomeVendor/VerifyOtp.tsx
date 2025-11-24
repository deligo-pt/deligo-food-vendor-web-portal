"use client";

import { useEffect, useRef, useState } from "react";

import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { TResponse } from "@/src/types";
import { setCookie } from "@/src/utils/cookies";
import { postData } from "@/src/utils/requests";
import { motion } from "framer-motion";
import { Clock, RefreshCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function VerifyOtp({ email }: { email: string }) {
  const router = useRouter();
  const [timer, setTimer] = useState(300); // 5 minutes = 300 seconds
  const [otp, setOtp] = useState(["", "", "", ""]);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const canResend = timer <= 0;

  // Countdown timer
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((t) => t - 1), 1000); // ✅ every 1 second
      return () => clearInterval(interval);
    }
  }, [timer]);

  // Handle OTP input change
  const handleChange = (value: string, index: number) => {
    if (/^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (value && index < 3) inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalOtp = otp.join("");
    if (finalOtp.length === 4) {
      const toastId = toast.loading("Verifying OTP...");
      try {
        const result = (await postData(
          "/auth/verify-otp",
          {
            email,
            otp: finalOtp,
          }
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        )) as unknown as TResponse<any>;

        if (result.success) {
          setCookie("accessToken", result.data.accessToken, 7);
          setCookie("refreshToken", result.data.refreshToken, 365);
          toast.success(result.message||"OTP verified successfully!", { id: toastId });
          router.push("/become-vendor/personal-details");
          return;
        }
        toast.error(result.message, { id: toastId });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        toast.error(
          error?.response?.data?.message || "OTP verification failed",
          {
            id: toastId,
          }
        );
        console.log(error);
      }
    } else {
      alert("Please enter a valid 4-digit OTP");
    }
  };

  const resendOtp = async () => {
    const toastId = toast.loading("Resending OTP...");
    try {
      const result = (await postData(
        "/auth/resend-otp",
        {
          email,
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      )) as unknown as TResponse<any>;

      if (result.success) {
        setTimer(300);
        console.log("OTP resent!");
        toast.success("OTP resent successfully!", { id: toastId });
        return;
      }
      toast.error(result.message, { id: toastId });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "OTP resend failed", {
        id: toastId,
      });
      console.log(error);
    }
  };

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-linear-to-br from-gray-100 to-gray-200 px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <Card className="p-6 shadow-xl border border-pink-100">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-semibold text-[#DC3173]">
              Verify OTP
            </CardTitle>
            <p className="text-gray-500 text-sm mt-1">
              Enter the 4-digit code sent to your email
            </p>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* OTP Inputs */}
              <div className="flex justify-center gap-4">
                {otp.map((digit, index) => (
                  <div
                    key={index}
                    className="relative group transition-transform duration-300 hover:scale-105"
                  >
                    <Input
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleChange(e.target.value, index)}
                      onKeyDown={(e) => handleKeyDown(e, index)}
                      ref={(el) => {
                        inputRefs.current[index] = el;
                      }}
                      className="w-14 h-14 text-center text-2xl font-bold rounded-xl border border-gray-300 shadow-sm bg-white focus-visible:ring-2 focus-visible:ring-[#DC3173]/70 focus-visible:border-[#DC3173] group-hover:border-[#DC3173]/50 transition-all duration-300"
                    />

                    {/* Glowing animated ring when focused */}
                    <span className="absolute inset-0 rounded-xl pointer-events-none group-focus-within:shadow-[0_0_12px_#DC3173aa] transition-all duration-300"></span>
                  </div>
                ))}
              </div>

              {/* Timer & Resend Section */}
              <div className="flex justify-between items-center text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4 text-[#DC3173]" />
                  {canResend ? (
                    <span className="text-gray-500">Expired</span>
                  ) : (
                    <span>{formatTime(timer)} remaining</span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={resendOtp}
                  disabled={!canResend}
                  className={`flex items-center gap-1 font-medium ${
                    canResend
                      ? "text-[#DC3173] hover:text-[#a72b5c]"
                      : "text-gray-400 cursor-not-allowed"
                  } transition-colors`}
                >
                  <RefreshCcw className="w-4 h-4" />
                  Resend OTP
                </button>
              </div>

              {/* Verify Button */}
              <Button
                type="submit"
                className="w-full bg-[#DC3173] hover:bg-[#a72b5c] transition-all duration-300 text-white text-lg font-medium py-2 rounded-lg shadow-md hover:shadow-lg"
              >
                Verify
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
