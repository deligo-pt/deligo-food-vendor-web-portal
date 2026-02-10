import FormSkeleton from "@/src/components/Skeletons/common/FormSkeleton";
import SkeletonBase from "@/src/components/Skeletons/common/SkeletonBase";

export default function Loading() {
  return (
    <div className="p-6">
      <div className="bg-white rounded-xl shadow-xl overflow-hidden">
        <div className="animate-pulse h-16 w-full bg-[#DC3173] p-4 space-y-3">
          <SkeletonBase className="h-6 w-24 rounded" />
        </div>
        <div className="md:flex gap-6 h-full p-4">
          <div className="h-full w-full md:w-64 space-y-3">
            <SkeletonBase className="h-42 w-full rounded" />
          </div>
          <div className="py-0 flex-1 my-6 md:my-0">
            <FormSkeleton fields={4} />
          </div>
        </div>
      </div>
    </div>
  );
}
