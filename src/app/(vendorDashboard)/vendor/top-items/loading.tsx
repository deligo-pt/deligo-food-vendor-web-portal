import StatSkeleton from "@/src/components/Skeletons/common/StatSkeleton";
import TitleHeaderSkeleton from "@/src/components/Skeletons/common/TitleHeaderSkeleton";

export default function Loading() {
  return (
    <div className="p-6 space-y-6">
      <TitleHeaderSkeleton />
      <div className="grid grid-cols-1 gap-4 w-full">
        <StatSkeleton count={1} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        <StatSkeleton count={4} />
      </div>
    </div>
  );
}
