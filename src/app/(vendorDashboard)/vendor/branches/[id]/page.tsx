import BranchDetails from "@/src/components/Dashboard/BranchManagement/BranchDetails";
import { getVendorDetails } from "@/src/services/dashboard/profile/profile.service";

interface IProps {
    params: { id: string };
};


const BranchDetailsPage = async ({ params }: IProps) => {
    const { id } = await params;
    const branchDetailsRes = await getVendorDetails(id);

    return (
        <div>
            <BranchDetails branch={branchDetailsRes?.data} />
        </div>
    );
};

export default BranchDetailsPage;