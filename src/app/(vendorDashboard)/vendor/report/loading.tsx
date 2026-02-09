import FormSkeleton from "@/src/components/Skeletons/common/FormSkeleton";
import TitleHeaderSkeleton from "@/src/components/Skeletons/common/TitleHeaderSkeleton";

export default function Loading() {
  return (
    <div className="p-6">
      <TitleHeaderSkeleton />
      <div className="bg-white p-4 rounded-xl shadow-xl my-6">
        <FormSkeleton fields={3} />
      </div>
    </div>
  );
}
