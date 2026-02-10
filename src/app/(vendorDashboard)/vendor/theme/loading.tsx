import FormSkeleton from "@/src/components/Skeletons/common/FormSkeleton";
import TitleHeaderSkeleton from "@/src/components/Skeletons/common/TitleHeaderSkeleton";

export default function Loading() {
  return (
    <div className="p-6">
      <TitleHeaderSkeleton />

      <div className="grid md:grid-cols-3 gap-6 my-12">
        <div className="col-span-2 space-y-6">
          <div className="bg-white p-4 rounded-xl shadow-xl">
            <FormSkeleton fields={5} />
          </div>
          <div className="bg-white p-4 rounded-xl shadow-xl">
            <FormSkeleton fields={4} />
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-4 rounded-xl shadow-xl">
            <FormSkeleton fields={3} />
          </div>
          <div className="bg-white p-4 rounded-xl shadow-xl">
            <FormSkeleton fields={2} />
          </div>
          <div className="bg-white p-4 rounded-xl shadow-xl">
            <FormSkeleton fields={4} />
          </div>
          <div className="bg-white p-4 rounded-xl shadow-xl">
            <FormSkeleton fields={4} />
          </div>
        </div>
      </div>
    </div>
  );
}
