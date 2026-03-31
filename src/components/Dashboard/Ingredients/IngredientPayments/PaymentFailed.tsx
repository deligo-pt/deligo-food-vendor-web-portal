"use client";
import SkeletonBase from "@/src/components/Skeletons/common/SkeletonBase";
import { XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function PaymentFailure() {
  const [seconds, setSeconds] = useState(8);
  const router = useRouter();

  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;

    if (seconds !== 0) {
      timer = setInterval(() => {
        setSeconds((prev) => prev - 1);
      }, 1000);
    } else {
      if (timer) clearInterval(timer);
      router.push("/vendor/ingredients");
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [seconds, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-sm p-8 text-center space-y-6 border border-gray-100">
        <div className="flex justify-center">
          <div className="bg-red-100 p-4 rounded-full">
            <XCircle className="w-16 h-16 text-red-500" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-gray-900">Payment Failed</h1>
          <p className="text-gray-500">
            Something went wrong with your transaction. Please try again or use
            a different method.
          </p>
        </div>

        <div className="pt-4 space-y-3">
          <SkeletonBase className="h-1 w-full bg-red-100" />
          <p className="text-sm text-gray-400">
            Returning to Ingredients in{" "}
            <span className="font-bold text-[#e91e63]">{seconds}s</span>...
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => router.push("/vendor/ingredients")}
            className="w-full py-3 bg-gray-900 text-white rounded-xl font-semibold hover:bg-black transition-colors"
          >
            Go to Ingredients
          </button>
          <button
            onClick={() => router.push("/chat-support")}
            className="w-full py-3 text-gray-500 font-medium hover:text-gray-700"
          >
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
}
