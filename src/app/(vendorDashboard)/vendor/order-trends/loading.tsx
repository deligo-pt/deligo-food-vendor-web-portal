import { Separator } from "@/components/ui/separator";
import SkeletonBase from "@/src/components/Skeletons/common/SkeletonBase";
import TitleHeaderSkeleton from "@/src/components/Skeletons/common/TitleHeaderSkeleton";

export default function Loading() {
  const barHeights = [100, 160, 120, 180, 90];
  return (
    <div className="p-6">
      <TitleHeaderSkeleton />

      <div className="bg-white p-4 rounded-xl shadow-xl my-6 md:flex justify-between gap-4">
        <div className="space-y-4">
          <SkeletonBase className="h-4 w-20 rounded" />
          <SkeletonBase className="h-12 w-32 rounded" />
          <SkeletonBase className="h-4 w-28 rounded" />
        </div>
        <div className="flex items-center">
          <SkeletonBase className="h-12 w-12 rounded" />
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-xl my-6">
        <SkeletonBase className="h-4 w-24 rounded" />
        <Separator className="my-2" />
        <div className="flex gap-4 items-end">
          {Array.from({ length: 15 }).map((_, i) => (
            <div
              className="w-full"
              style={{
                height: `${barHeights[i % barHeights.length]}px`,
              }}
              key={i}
            >
              <SkeletonBase className="h-full w-full rounded" />
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-xl my-6">
        <SkeletonBase className="h-4 w-24 rounded" />
        <Separator className="my-2" />
        <div className="space-y-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex justify-between gap-4">
              <SkeletonBase className="h-4 w-20 lg:w-56 rounded" />
              <SkeletonBase className="h-4 w-20 lg:w-56 rounded" />
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-xl my-6">
        <SkeletonBase className="h-4 w-24 rounded" />
        <div className="space-y-5 mt-5">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex gap-8">
              <SkeletonBase className="h-4 w-12 rounded" />
              <SkeletonBase className="h-4 w-32 lg:w-52 rounded" />
              <SkeletonBase className="h-4 w-4 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
