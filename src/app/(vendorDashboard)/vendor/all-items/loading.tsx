import CardGridSkeleton from "@/src/components/Skeletons/common/CardGridSkeleton";
import FilterSkeleton from "@/src/components/Skeletons/common/FilterSkeleton";
import PaginationSkeleton from "@/src/components/Skeletons/common/PaginationSkeleton";
import TitleHeaderSkeleton from "@/src/components/Skeletons/common/TitleHeaderSkeleton";

export default function Loading() {
  return (
    <div className="p-6 space-y-6">
      <TitleHeaderSkeleton />
      <FilterSkeleton />
      <CardGridSkeleton count={12} />
      <PaginationSkeleton />
    </div>
  );
}
