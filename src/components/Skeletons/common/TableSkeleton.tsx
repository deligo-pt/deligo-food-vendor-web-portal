import SkeletonBase from "@/src/components/Skeletons/common/SkeletonBase";

const TableSkeleton = ({
  rows = 5,
  cols = 5,
}: {
  rows?: number;
  cols?: number;
}) => {
  return (
    <div className="w-full bg-white rounded-xl border border-gray-100 overflow-hidden">
      <div className="p-4 border-b border-gray-100 flex gap-4">
        {Array.from({ length: cols }).map((_, i) => (
          <SkeletonBase key={i} className="h-4 flex-1" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="p-4 flex gap-4 border-b border-gray-50 items-center"
        >
          {Array.from({ length: cols }).map((_, j) => (
            <SkeletonBase key={j} className="h-3 flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
};

export default TableSkeleton;
