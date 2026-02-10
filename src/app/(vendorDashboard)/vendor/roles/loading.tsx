import { Separator } from "@/components/ui/separator";
import SkeletonBase from "@/src/components/Skeletons/common/SkeletonBase";
import TitleHeaderSkeleton from "@/src/components/Skeletons/common/TitleHeaderSkeleton";

export default function Loading() {
  return (
    <div className="p-6">
      <TitleHeaderSkeleton />

      <div className="grid md:grid-cols-2 gap-6 my-10">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white px-4 py-8 rounded-xl shadow-xl">
            <div className="flex gap-4">
              <SkeletonBase className="h-20 w-20 rounded" />
              <div className="space-y-4">
                <SkeletonBase className="h-8 w-24 rounded" />
                <SkeletonBase className="h-8 w-32 rounded" />
              </div>
            </div>

            <Separator className="my-4" />

            <div className="space-y-4">
              {[100, 90, 180, 160, 120].map((w, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div style={{ width: `${w}px` }}>
                    <SkeletonBase className="h-6 w-full rounded" />
                  </div>
                  <SkeletonBase className="h-6 w-10 rounded" />
                </div>
              ))}
            </div>

            <SkeletonBase className="h-12 w-full rounded my-4" />
          </div>
        ))}
      </div>
    </div>
  );
}
