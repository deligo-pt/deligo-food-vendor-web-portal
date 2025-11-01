"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Clock, ShieldCheck } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function RegistrationStatusPage() {
      const router = useRouter();
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-pink-50 to-[#DC3173]/10 px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-2xl"
      >
        <Card className="rounded-3xl shadow-2xl border border-[#DC3173]/20 overflow-hidden backdrop-blur-sm bg-white/90">
          <CardHeader className="bg-gradient-to-r from-[#DC3173] to-pink-600 text-white p-6">
            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-white/20 p-3">
                <CheckCircle2 className="w-7 h-7 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold tracking-wide">
                Registration Completed
              </CardTitle>
            </div>
            <p className="mt-2 text-sm text-white/90 max-w-xl">
              Congratulations! You’ve successfully submitted your registration details.
            </p>
          </CardHeader>

          <CardContent className="p-8 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col sm:flex-row items-center sm:items-start gap-6"
            >
              <div className="rounded-full bg-[#DC3173]/10 p-4">
                <Clock className="w-10 h-10 text-[#DC3173]" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Review in Progress
                </h3>
                <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                  Our admin team is currently reviewing your information.  
                  You will receive an update within <span className="font-medium text-[#DC3173]">24–48 hours</span> once the verification process is complete.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row items-center sm:items-start gap-6"
            >
              <div className="rounded-full bg-green-100 p-4">
                <ShieldCheck className="w-10 h-10 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Next Step — Verification
                </h3>
                <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                  Once your details are verified, you will become a{" "}
                  <span className="font-semibold text-green-600">Verified Partner</span>  
                  and gain access to the vendor dashboard, store management, and payouts.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="pt-6 text-center"
            >
              <Button
                className="px-8 py-3 bg-[#DC3173] hover:bg-[#b72a63] text-white rounded-xl text-lg font-medium shadow-lg transition-all duration-300"
                onClick={() => router.push("/")}
                
              >
                Go to Dashboard
              </Button>

              <p className="text-xs text-gray-500 mt-3">
                You can check your application status anytime in your vendor dashboard.
              </p>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
