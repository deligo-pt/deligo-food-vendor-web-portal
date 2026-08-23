import EditBranch from "@/src/components/Dashboard/BranchManagement/EditBranch";
import { getAllBusinessCategories } from "@/src/services/dashboard/categories/business-categories.service";
import { getAllCuisines } from "@/src/services/dashboard/cuisine/cuisine.service";
import { getVendorDetails } from "@/src/services/dashboard/profile/profile.service";

interface IProps {
    params: { id: string };
}


const EditBranchPage = async ({ params }: IProps) => {
    const { id } = await params;
    const { data } = await getVendorDetails(id);
    const { data: cuisines } = await getAllCuisines();
    const { data: businessCategories } = await getAllBusinessCategories();

    return (
        <div>
            <EditBranch branch={data} cuisines={cuisines} businessCategories={businessCategories} />
        </div>
    );
};

export default EditBranchPage;