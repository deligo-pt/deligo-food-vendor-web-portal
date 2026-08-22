"use client";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useTranslation } from "@/src/hooks/use-translation";
import { resendOtpReq, verifyOtpReq } from "@/src/services/auth/auth";
import { motion } from "framer-motion";
import { jwtDecode } from "jwt-decode";
import { Clock, MailIcon, RefreshCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

const BranchVerifyOTP = ({ email }: { email: string }) => {
    const { t } = useTranslation();
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [timer, setTimer] = useState(300);
    const [otp, setOtp] = useState(["", "", "", ""]);
    const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
    const canResend = timer <= 0;

    // Countdown timer
    useEffect(() => {
        if (timer > 0) {
            const interval = setInterval(() => setTimer((t) => t - 1), 1000); // every 1 second
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
        index: number,
    ) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        const toastId = toast.loading("Verifying OTP...");
        const finalOtp = otp.join("");

        if (finalOtp.length === 4) {
            const result = await verifyOtpReq({
                email,
                otp: finalOtp,
                role: "SUB_VENDOR",
            });

            if (result.success) {
                toast.success("OTP verified successfully!", { id: toastId });
                const decoded = jwtDecode(result.data.accessToken) as {
                    userId: string;
                };
                router.push(`/vendor/branches/edit/${decoded?.userId}`);
                return;
            }

            toast.error(result.message || "OTP verification failed", { id: toastId });
            setIsSubmitting(false);
        } else {
            toast.error("Please enter a valid 4-digit OTP", { id: toastId });
            setIsSubmitting(false);
        }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData("text").trim();

        if (/^\d+$/.test(pastedData)) {
            const codeDigits = pastedData.slice(0, 4).split("");

            const newOtp = [...otp];
            for (let i = 0; i < 4; i++) {
                newOtp[i] = codeDigits[i] || "";
            }
            setOtp(newOtp);

            const targetIndex = Math.min(codeDigits.length, 3);
            inputRefs.current[targetIndex]?.focus();
        }
    };

    const resendOtp = async () => {
        const toastId = toast.loading("Resending OTP...");
        setIsSubmitting(true);

        const result = await resendOtpReq({ email, role: "SUB_VENDOR", });

        if (result.success) {
            setTimer(300);
            console.log("OTP resent!");
            toast.success("OTP resent successfully!", { id: toastId });
            return;
        }

        toast.error(result.message || "OTP resend failed", { id: toastId });
        setIsSubmitting(false);
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
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-md"
        >
            <Card className="shadow-xl border border-pink-100 py-0">
                <CardHeader className="bg-linear-to-r from-[#DC3173]/10 to-[#DC3173]/5 rounded-t-lg py-6">
                    <div className="flex justify-center mb-2">
                        <motion.div
                            initial={{
                                scale: 0,
                            }}
                            animate={{
                                scale: 1,
                            }}
                            transition={{
                                type: "spring",
                                stiffness: 260,
                                damping: 20,
                            }}
                            className="w-12 h-12 rounded-full bg-[#DC3173]/10 flex items-center justify-center"
                        >
                            <MailIcon className="w-6 h-6 text-[#DC3173]" />
                        </motion.div>
                    </div>
                    <CardTitle className="text-center text-[#DC3173]">
                        {t("verify_branch_email")}
                    </CardTitle>
                    <CardDescription className="text-center">
                        {t("otp4DigitCode")}
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6 py-6">
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
                                        onPaste={handlePaste}
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
                                    <span className="text-gray-500">{t("expired")}</span>
                                ) : (
                                    <span>
                                        {formatTime(timer)} {t("remaining")}
                                    </span>
                                )}
                            </div>

                            <button
                                type="button"
                                onClick={resendOtp}
                                disabled={!canResend}
                                className={`flex items-center gap-1 font-medium ${canResend
                                    ? "text-[#DC3173] hover:text-[#a72b5c]"
                                    : "text-gray-400 cursor-not-allowed"
                                    } transition-colors`}
                            >
                                <RefreshCcw className="w-4 h-4" />
                                {t("resendOTP")}
                            </button>
                        </div>

                        {/* Verify Button */}
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-[#DC3173] hover:bg-[#a72b5c] transition-all duration-300 text-white text-lg font-medium py-2 rounded-lg shadow-md hover:shadow-lg"
                        >
                            {isSubmitting ? "Verifying..." : t("verify")}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </motion.div>
    );
}

export default BranchVerifyOTP;