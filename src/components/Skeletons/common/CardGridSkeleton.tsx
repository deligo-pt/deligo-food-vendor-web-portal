import SkeletonBase from "@/src/components/Skeletons/common/SkeletonBase";

const CardGridSkeleton = ({ count = 6 }: { count?: number }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm"
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
  );
};

export default CardGridSkeleton;
