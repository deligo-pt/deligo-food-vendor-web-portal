import StatSkeleton from "@/src/components/Skeletons/common/StatSkeleton";
import TitleHeaderSkeleton from "@/src/components/Skeletons/common/TitleHeaderSkeleton";

export default function Loading() {
  return (
    <div className="p-6 space-y-8">
      <TitleHeaderSkeleton />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
        <StatSkeleton count={3} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 w-full">
        <StatSkeleton count={4} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
        <div className="col-span-2">
          <StatSkeleton count={1} />
        </div>
        <StatSkeleton count={1} />
      </div>

      <div className="space-y-4 bg-white p-6 rounded-xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 w-full">
          <StatSkeleton count={4} />
        </div>
      </div>
    </div>
  );
}
