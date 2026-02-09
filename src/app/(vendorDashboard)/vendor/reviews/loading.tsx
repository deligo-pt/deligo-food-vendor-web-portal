import SkeletonBase from "@/src/components/Skeletons/common/SkeletonBase";
import StatSkeleton from "@/src/components/Skeletons/common/StatSkeleton";
import TitleHeaderSkeleton from "@/src/components/Skeletons/common/TitleHeaderSkeleton";

export default function Loading() {
  return (
    <div className="p-6 space-y-6">
      <TitleHeaderSkeleton />
      <div className="grid grid-cols-1 gap-4 w-full">
        <StatSkeleton count={1} />
      </div>
      <div className="my-6 flex items-center gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonBase key={i} className="h-8 w-16" />
        ))}
      </div>
      <div className="space-y-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 mb-6"
          >
            <div className="flex items-center gap-4 mb-6">
              <SkeletonBase className="h-14 w-14 rounded-full" />
              <div className="space-y-2">
                <SkeletonBase className="h-4 w-32" />
                <SkeletonBase className="h-3 w-20" />
              </div>
            </div>
            <div className="space-y-3">
              <SkeletonBase className="h-3 w-full" />
              <SkeletonBase className="h-3 w-full" />
              <SkeletonBase className="h-10 w-full mt-4 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
