import SkeletonBase from "@/src/components/Skeletons/common/SkeletonBase";
import StatSkeleton from "@/src/components/Skeletons/common/StatSkeleton";
import TitleHeaderSkeleton from "@/src/components/Skeletons/common/TitleHeaderSkeleton";

/**
 * Shown the moment "Refer & earn" is clicked, while the server page waits for
 * `/referrals/my-referrals`. Without it Next keeps the previous page on screen
 * until the whole page is ready, so the click looked like it did nothing.
 * Same layout as `ReferEarn`, so nothing jumps when the data arrives.
 */
export default function Loading() {
  return (
    <div className="min-h-screen space-y-6" aria-busy="true">
      <TitleHeaderSkeleton />

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Code card */}
        <div className="space-y-5 rounded-2xl border border-[#DC3173]/20 bg-white p-5 shadow-sm sm:p-6 lg:col-span-3">
          <div className="flex items-center gap-3">
            <SkeletonBase className="h-12 w-12 rounded-xl" />
            <SkeletonBase className="h-5 w-44" />
          </div>
          <SkeletonBase className="h-20 w-full rounded-xl" />
          <div className="grid grid-cols-2 gap-3">
            <SkeletonBase className="h-9 w-full" />
            <SkeletonBase className="h-9 w-full" />
          </div>
        </div>

        {/* How it works */}
        <div className="space-y-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6 lg:col-span-2">
          <SkeletonBase className="h-5 w-32" />
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-start gap-3">
              <SkeletonBase className="h-6 w-6 shrink-0 rounded-full" />
              <SkeletonBase className="h-4 w-full" />
            </div>
          ))}
          <SkeletonBase className="h-12 w-full rounded-lg" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <StatSkeleton count={4} />
      </div>

      {/* Who used your code */}
      <div className="space-y-4 rounded-2xl bg-white p-4 shadow-md md:p-6">
        <SkeletonBase className="h-5 w-48" />
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <SkeletonBase className="h-9 w-9 shrink-0 rounded-full" />
            <SkeletonBase className="h-4 flex-1" />
            <SkeletonBase className="h-5 w-20 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
