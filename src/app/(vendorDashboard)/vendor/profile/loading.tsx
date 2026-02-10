import FormSkeleton from "@/src/components/Skeletons/common/FormSkeleton";
import SkeletonBase from "@/src/components/Skeletons/common/SkeletonBase";

export default function Loading() {
  return (
    <div>
      <div className="relative bg-linear-to-r from-[#DC3173] to-[#FF6B9D] h-48 overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute inset-0" />
      </div>

      <div className="px-4 md:px-6 -mt-20 pb-12">
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-8 relative flex gap-4">
          <SkeletonBase className="h-24 w-24 rounded-full" />
          <div className="space-y-4">
            <SkeletonBase className="h-8 w-32 md:w-52 rounded" />
            <SkeletonBase className="h-4 w-36 md:w-60 rounded" />
            <SkeletonBase className="h-6 w-24 md:w-44 rounded" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[4, 4, 4, 4, 2, 2].map((fields, i) => (
            <div
              key={i}
              className="bg-white rounded-xl shadow-xl p-8 space-y-6"
            >
              <div className="flex items-center gap-3">
                <SkeletonBase className="h-8 w-8 rounded-full" />
                <SkeletonBase className="h-4 w-32 rounded-full" />
              </div>
              <FormSkeleton fields={fields} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
