import AllMenus from "@/src/components/Dashboard/Menu/AllMenus";
import { getAllMenus } from "@/src/services/dashboard/menu/menu.service";
import { TMeta } from "@/src/types";
import { IMenu } from "@/src/types/menu.type";


const AllMenusPage = async () => {
    const menusResult = await getAllMenus();

    return (
        <div>
            <AllMenus menusResult={menusResult as { data: IMenu[], meta: TMeta, success: boolean, message: string }} />
        </div>
    );
};

export default AllMenusPage;