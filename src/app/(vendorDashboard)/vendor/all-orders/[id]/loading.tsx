import SkeletonBase from "@/src/components/Skeletons/common/SkeletonBase";

export default function Loading() {
  return (
    <div className="p-6">
      <div className="bg-white rounded-xl shadow-xl overflow-hidden min-h-screen md:min-h-0">
        <div className="bg-gradient-to-r from-[#DC3173] to-[#e45a92] p-6">
          <div className="flex items-center gap-4">
            <div>
              <SkeletonBase className="w-6 h-6" />
            </div>
            <div className="space-y-2">
              <SkeletonBase className="w-52 h-5" />
              <div className="flex items-center gap-2 mt-1">
                <SkeletonBase className="w-4 h-4" />
                <SkeletonBase className="w-32 h-4" />
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center gap-2">
                <SkeletonBase className="w-5 h-5 text-[#DC3173]" />
                <SkeletonBase className="w-32 h-4" />
                <SkeletonBase className="w-28 h-3 ml-auto" />
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3">
                        <SkeletonBase className="w-32 h-4" />
                      </th>
                      <th className="px-6 py-3">
                        <SkeletonBase className="w-20 h-4 mx-auto" />
                      </th>
                      <th className="px-6 py-3">
                        <SkeletonBase className="w-28 h-4 ml-auto" />
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <tr key={i}>
                        <td className="px-6 py-4 space-y-2">
                          <SkeletonBase className="w-38 h-4" />
                          <SkeletonBase className="w-28 h-4" />
                        </td>
                        <td className="px-6 py-4">
                          <SkeletonBase className="w-6 h-4 mx-auto" />
                        </td>
                        <td className="px-6 py-4">
                          <SkeletonBase className="w-32 h-4 ml-auto" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="p-5 rounded-lg border border-gray-200 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <SkeletonBase className="w-5 h-5" />
                <SkeletonBase className="w-32 h-4" />
              </div>
              <div className="space-y-3">
                <SkeletonBase className="w-32 h-4" />
                <div className="flex items-start gap-2">
                  <SkeletonBase className="w-4 h-4 mt-0.5" />
                  <SkeletonBase className="w-52 h-4" />
                </div>
                <SkeletonBase className="w-32 h-4" />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-lg border border-gray-200 overflow-hidden shadow-sm">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center gap-2">
                <SkeletonBase className="w-5 h-5" />
                <SkeletonBase className="w-32 h-5" />
              </div>

              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <SkeletonBase className="w-5 h-5" />
                    <SkeletonBase className="w-32 h-5" />
                  </div>
                  <SkeletonBase className="w-32 h-5" />
                </div>

                <div className="border-t border-gray-100 pt-4 mt-4 flex justify-between">
                  <SkeletonBase className="w-32 h-5" />
                  <div className="space-y-2">
                    <SkeletonBase className="w-28 h-12" />
                    <SkeletonBase className="w-24 h-4" />
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex items-center gap-2">
                <SkeletonBase className="w-4 h-4" />
                <SkeletonBase className="w-32 h-5" />
              </div>
              <div className="p-4 flex items-center gap-4">
                <SkeletonBase className="w-12 h-12" />
                <div className="space-y-2">
                  <SkeletonBase className="w-36 h-4" />
                  <SkeletonBase className="w-28 h-3" />
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex items-center gap-2">
                <SkeletonBase className="w-4 h-4" />
                <SkeletonBase className="w-32 h-5" />
              </div>
              <div className="p-4 flex items-center gap-4">
                <SkeletonBase className="w-12 h-12" />
                <div className="space-y-2">
                  <SkeletonBase className="w-36 h-4" />
                  <SkeletonBase className="w-28 h-3" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
