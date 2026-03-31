import SkeletonBase from "@/src/components/Skeletons/common/SkeletonBase";

export default function Loader() {
  return (
    <div className="min-h-full flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-sm p-8 text-center space-y-8 border border-gray-100 flex flex-col items-center">
        <SkeletonBase className="h-28 w-28 rounded-full" />

        <div className="space-y-3 flex flex-col items-center w-full">
          <SkeletonBase className="h-8 w-64 rounded-lg" />

          <SkeletonBase className="h-4 w-full rounded-md" />
          <SkeletonBase className="h-4 w-4/5 rounded-md" />
        </div>

        <div className="pt-4 space-y-3 w-full flex flex-col items-center">
          <SkeletonBase className="h-2 w-full rounded-full bg-green-100" />
          <SkeletonBase className="h-4 w-52 rounded-md" />
        </div>

        <SkeletonBase className="h-14 w-full rounded-xl" />
      </div>
    </div>
  );
}
