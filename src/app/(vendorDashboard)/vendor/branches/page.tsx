import AllBranches from "@/src/components/Dashboard/BranchManagement/AllBranches";
import { getAllBranches } from "@/src/services/dashboard/branch/branch.service";
import { queryStringFormatter } from "@/src/utils/formatter";
import { jwtDecode } from "jwt-decode";
import { cookies } from "next/headers";
import type { ComponentProps } from "react";

type IProps = {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
};


const AllBranchesPage = async ({ searchParams }: IProps) => {
    const accessToken = (await cookies()).get("accessToken")?.value || "";
    const decoded = jwtDecode(accessToken) as { role: string; userId: string };

    const params = await searchParams;
    const queryString = queryStringFormatter(params);
    const result = await getAllBranches(decoded?.userId, queryString);


    return (
        <div>
            <AllBranches branches={result as ComponentProps<typeof AllBranches>["branches"]}
            />
        </div>
    );
};

export default AllBranchesPage;