import SkeletonBase from "@/src/components/Skeletons/common/SkeletonBase";
import StatSkeleton from "@/src/components/Skeletons/common/StatSkeleton";
import TitleHeaderSkeleton from "@/src/components/Skeletons/common/TitleHeaderSkeleton";

export default function Loading() {
  return (
    <div className="p-6 space-y-8">
      <TitleHeaderSkeleton />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full bg-white p-8 rounded-xl">
        <SkeletonBase className="h-8 w-full rounded" />
        <SkeletonBase className="h-8 w-full rounded" />
        <SkeletonBase className="h-8 w-full rounded" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
        <StatSkeleton count={4} />
      </div>

      <div className="grid grid-cols-7 gap-2 sm:gap-4 md:gap-6 w-full bg-white rounded-xl p-4 items-end">
        <SkeletonBase className="h-20 w-full rounded-lg" />
        <SkeletonBase className="h-32 w-full rounded-lg" />
        <SkeletonBase className="h-10 w-full rounded-lg" />
        <SkeletonBase className="h-80 w-full rounded-lg" />
        <SkeletonBase className="h-52 w-full rounded-lg" />
        <SkeletonBase className="h-42 w-full rounded-lg" />
        <SkeletonBase className="h-32 w-full rounded-lg" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        <StatSkeleton count={2} />
      </div>
    </div>
  );
}
