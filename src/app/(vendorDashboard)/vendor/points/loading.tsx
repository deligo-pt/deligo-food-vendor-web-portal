import SkeletonBase from "@/src/components/Skeletons/common/SkeletonBase";
import StatSkeleton from "@/src/components/Skeletons/common/StatSkeleton";
import TitleHeaderSkeleton from "@/src/components/Skeletons/common/TitleHeaderSkeleton";

/** Shown at once on "My points", in the page's shape (see `MyPoints`). */
export default function Loading() {
  return (
    <div className="min-h-screen space-y-6" aria-busy="true">
      <TitleHeaderSkeleton />

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
        <div className="col-span-2 h-28 animate-pulse rounded-2xl bg-[#DC3173]/70 lg:col-span-1" />
        <StatSkeleton count={2} />
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="space-y-4 rounded-2xl bg-white p-4 shadow-md md:p-6 xl:col-span-2">
          <SkeletonBase className="h-5 w-40" />
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <SkeletonBase className="h-8 w-8 shrink-0 rounded-lg" />
              <SkeletonBase className="h-4 flex-1" />
              <SkeletonBase className="h-4 w-12" />
            </div>
          ))}
        </div>
        <div className="h-fit space-y-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
          <SkeletonBase className="h-5 w-36" />
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <SkeletonBase className="h-7 w-7 shrink-0 rounded-lg" />
              <SkeletonBase className="h-4 flex-1" />
              <SkeletonBase className="h-4 w-16" />
            </div>
          ))}
          <SkeletonBase className="h-12 w-full rounded-lg" />
        </div>
      </div>
    </div>
  );
}
