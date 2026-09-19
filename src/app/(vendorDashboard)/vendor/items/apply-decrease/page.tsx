import ApplyDecrease from "@/src/components/Dashboard/Products/ApplyDecrease/ApplyDecrease";
import { getAllProductCategoriesReq } from "@/src/services/dashboard/categories/product-categories";
import { getAllProducts } from "@/src/services/dashboard/products/products";
import { queryStringFormatter } from "@/src/utils/formatter";


const ApplyProductDiscountPage = async () => {
    const query = { "meta.status": "ACTIVE" };
    const queryString = queryStringFormatter(query);
    const { data } = await getAllProducts(queryString);
    const productCategries = await getAllProductCategoriesReq();

    return (
        <div>
            <ApplyDecrease products={data} productCategries={productCategries?.data} />
        </div>
    );
};

export default ApplyProductDiscountPage;