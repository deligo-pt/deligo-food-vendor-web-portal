import AllProductCategories from "@/src/components/Dashboard/ProductCategories/AllProductCategories";
import { getAllProductCategoriesReq } from "@/src/services/dashboard/categories/product-categories";
import { TProductCategoryResponse } from "@/src/types/category.type";

type IProps = {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
};

// Every category, unpaged and uncached: the list is dragged into order, and a
// move is sent as a place in the whole list, which a page of it can't give.
// The search filters on the page itself, for the same reason.
const AllProductCategoriesPage = async ({ searchParams }: IProps) => {
    const params = await searchParams;
    const searchTerm = typeof params.searchTerm === "string" ? params.searchTerm : "";
    const result = await getAllProductCategoriesReq("limit=500", { includeInactive: true, fresh: true });

    return (
        <div>
            <AllProductCategories
                categoriesResult={result as TProductCategoryResponse}
                searchTerm={searchTerm}
            />
        </div>
    );
};

export default AllProductCategoriesPage;
