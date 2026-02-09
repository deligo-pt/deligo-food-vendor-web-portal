import SkeletonBase from "@/src/components/Skeletons/common/SkeletonBase";

export const LiveChatSkeleton = () => {
  return (
    <section className="py-16 px-4 sm:px-10 lg:px-20">
      <div className="max-w-3xl mx-auto rounded-3xl shadow-2xl flex flex-col overflow-hidden h-[calc(100vh-226px)] bg-white">
        <div className="flex items-center gap-3 bg-[#DC3173] p-6 rounded-t-3xl opacity-80">
          <SkeletonBase className="w-7 h-7 rounded-full bg-white/20" />
          <SkeletonBase className="h-8 w-48 bg-white/20" />
        </div>

        <div className="flex-1 p-6 space-y-6 overflow-hidden">
          <div className="flex justify-start">
            <div className="space-y-2 max-w-[70%]">
              <SkeletonBase className="h-12 w-64 rounded-2xl rounded-bl-none" />
              <SkeletonBase className="h-3 w-16" />
            </div>
          </div>

          <div className="flex justify-end">
            <div className="space-y-2 max-w-[70%] flex flex-col items-end">
              <SkeletonBase className="h-16 w-72 rounded-2xl rounded-br-none bg-pink-50" />
              <SkeletonBase className="h-3 w-16" />
            </div>
          </div>

          <div className="flex justify-start">
            <div className="space-y-2 max-w-[70%]">
              <SkeletonBase className="h-12 w-48 rounded-2xl rounded-bl-none" />
              <SkeletonBase className="h-3 w-16" />
            </div>
          </div>

          <div className="flex justify-end">
            <div className="space-y-2 max-w-[70%] flex flex-col items-end">
              <SkeletonBase className="h-12 w-56 rounded-2xl rounded-br-none bg-pink-50" />
              <SkeletonBase className="h-3 w-16" />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 p-5 bg-gray-200 rounded-b-3xl">
          <SkeletonBase className="flex-1 h-12 rounded-2xl bg-white" />
          <SkeletonBase className="h-12 w-12 rounded-full bg-[#DC3173] opacity-50" />
        </div>
      </div>
    </section>
  );
};
