import AllProductCategories from "@/src/components/Dashboard/ProductCategories/AllProductCategories";
import { getAllProductCategoriesReq } from "@/src/services/dashboard/categories/product-categories";
import { TProductCategoryResponse } from "@/src/types/category.type";
import { queryStringFormatter } from "@/src/utils/formatter";

type IProps = {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
};

const AllProductCategoriesPage = async ({ searchParams }: IProps) => {
    const params = await searchParams;
    const queryString = queryStringFormatter(params);
    const result = await getAllProductCategoriesReq(queryString);

    return (
        <div>
            <AllProductCategories categoriesResult={result as TProductCategoryResponse} />
        </div>
    );
};

export default AllProductCategoriesPage;