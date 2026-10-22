import SkeletonBase from "@/src/components/Skeletons/common/SkeletonBase";
import TitleHeaderSkeleton from "@/src/components/Skeletons/common/TitleHeaderSkeleton";

/**
 * The Product Categories page while it loads: the same shape as the sortable
 * list (handle, position, icon tile, name and status, the button row), so the
 * page doesn't jump when the categories arrive.
 */
export default function CategoryListSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="space-y-8" aria-busy="true">
      <TitleHeaderSkeleton />

      {/* Search */}
      <SkeletonBase className="h-10 w-full max-w-xs rounded-md" />

      <div className="space-y-4">
        {/* Help line */}
        <SkeletonBase className="h-4 w-full max-w-sm" />

        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className="flex flex-wrap items-center gap-x-3 gap-y-3 rounded-3xl border bg-white py-4 pl-2 pr-4 sm:py-5 sm:pr-5"
            style={{ boxShadow: "0px 4px 20px rgba(0,0,0,0.06)" }}
          >
            <div className="flex min-w-0 flex-1 basis-56 items-center gap-2 sm:gap-3">
              <div className="flex h-12 w-8 shrink-0 items-center justify-center">
                <SkeletonBase className="h-5 w-2.5 rounded" />
              </div>
              <SkeletonBase className="h-8 w-8 shrink-0 rounded-full bg-[#DC3173]/15" />
              <SkeletonBase className="hidden h-14 w-14 shrink-0 rounded-2xl sm:block" />
              <div className="space-y-2 sm:ml-1">
                <SkeletonBase className="h-5 w-36 sm:w-44" />
                <SkeletonBase className="h-4 w-14 rounded-full" />
              </div>
            </div>
            <div className="ml-auto flex shrink-0 items-center gap-1.5 sm:gap-2">
              {Array.from({ length: 5 }).map((_, b) => (
                <SkeletonBase key={b} className="h-9 w-9 rounded-xl" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
