import SkeletonBase from "@/src/components/Skeletons/common/SkeletonBase";
import TitleHeaderSkeleton from "@/src/components/Skeletons/common/TitleHeaderSkeleton";

/** Shown at once on "Rewards", in the page's shape (see `Rewards`). */
export default function Loading() {
  return (
    <div className="min-h-screen space-y-6" aria-busy="true">
      <TitleHeaderSkeleton />

      <div className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-sm sm:p-5">
        <SkeletonBase className="h-12 w-12 rounded-xl" />
        <div className="space-y-2">
          <SkeletonBase className="h-3 w-28" />
          <SkeletonBase className="h-6 w-14" />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="space-y-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex justify-between">
              <SkeletonBase className="h-12 w-12 rounded-xl" />
              <SkeletonBase className="h-7 w-20 rounded-full" />
            </div>
            <SkeletonBase className="h-5 w-40" />
            <SkeletonBase className="h-4 w-28" />
            <SkeletonBase className="h-9 w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
