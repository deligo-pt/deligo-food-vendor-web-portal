"use client";

import SkeletonBase from "@/src/components/Skeletons/common/SkeletonBase";
import { CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function PaymentSuccess() {
  const [seconds, setSeconds] = useState(5);
  const router = useRouter();

  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;

    if (seconds !== 0) {
      timer = setInterval(() => {
        setSeconds((prev) => prev - 1);
      }, 1000);
    } else {
      if (timer) clearInterval(timer);
      router.push("/vendor/ingredients/my-orders");
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [seconds, router]);

  return (
    <div className="min-h-full flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-sm p-8 text-center space-y-6 border border-gray-100">
        <div className="flex justify-center">
          <div className="bg-green-100 p-4 rounded-full">
            <CheckCircle2 className="w-16 h-16 text-green-500" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-gray-900">
            Payment Successful!
          </h1>
          <p className="text-gray-500">
            Your order has been processed successfully.
          </p>
        </div>

        <div className="pt-4 space-y-3">
          <SkeletonBase className="h-1 w-full bg-[#DC3173]/10" />
          <p className="text-sm text-gray-400">
            Redirecting to My Ingredient Orders in{" "}
            <span className="font-bold text-[#e91e63]">{seconds}s</span>...
          </p>
        </div>

        <button
          onClick={() => router.push("/vendor/ingredients/my-orders")}
          className="w-full py-3 bg-[#e91e63] text-white rounded-xl font-semibold hover:bg-[#d81b60] transition-colors"
        >
          Go to My Ingredient Orders Now
        </button>
      </div>
    </div>
  );
}
