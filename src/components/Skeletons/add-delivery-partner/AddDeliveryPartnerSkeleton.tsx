import SkeletonBase from "@/src/components/Skeletons/common/SkeletonBase";

export const AddDeliveryPartnerSkeleton = () => (
  <div className="flex flex-col items-center justify-center min-h-[70vh] p-6">
    <div className="w-full max-w-lg bg-pink-50/30 rounded-3xl p-10 border border-pink-100 shadow-sm space-y-8 flex flex-col items-center">
      {/* Top Icon Circle */}
      <SkeletonBase className="h-16 w-16 rounded-2xl bg-pink-100" />

      <div className="space-y-3 flex flex-col items-center w-full">
        <SkeletonBase className="h-6 w-48" />
        <SkeletonBase className="h-4 w-32" />
      </div>

      <div className="w-full space-y-6">
        <div className="space-y-2">
          <SkeletonBase className="h-4 w-12" />
          <SkeletonBase className="h-12 w-full rounded-xl" />
        </div>
        <div className="space-y-2">
          <SkeletonBase className="h-4 w-16" />
          <SkeletonBase className="h-12 w-full rounded-xl" />
        </div>
        <SkeletonBase className="h-12 w-full rounded-xl bg-[#DC3173] opacity-40 mt-4" />{" "}
        {/* Button */}
      </div>
    </div>
  </div>
);
