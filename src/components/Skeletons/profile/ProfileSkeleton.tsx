import SkeletonBase from "@/src/components/Skeletons/common/SkeletonBase";

export const ProfileSkeleton = () => (
  <div className="p-6 space-y-6">
    <div className="h-20 w-full bg-[#DC3173] rounded-t-2xl opacity-10" />

    <div className="bg-white rounded-2xl border border-gray-100 p-6 flex items-center gap-6 -mt-10 relative z-10 mx-4 shadow-sm">
      <SkeletonBase className="h-24 w-24 rounded-full border-4 border-white" />
      <div className="space-y-3">
        <div className="flex gap-3 items-center">
          <SkeletonBase className="h-6 w-40" />
          <SkeletonBase className="h-5 w-20 rounded-full" />
        </div>
        <SkeletonBase className="h-4 w-64" />
        <SkeletonBase className="h-3 w-24" />
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-2xl border border-gray-100 p-6 space-y-6"
        >
          <div className="flex items-center gap-3 border-b border-gray-50 pb-4">
            <SkeletonBase className="h-8 w-8 rounded-lg" />
            <SkeletonBase className="h-5 w-40" />
          </div>
          <div className="grid grid-cols-1 gap-4">
            {Array.from({ length: 3 }).map((_, j) => (
              <div key={j} className="flex flex-col gap-2">
                <SkeletonBase className="h-3 w-24" />
                <SkeletonBase className="h-4 w-full" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);
