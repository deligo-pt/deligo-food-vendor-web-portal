import ApplyDecrease from "@/src/components/Dashboard/Products/ApplyDecrease/ApplyDecrease";
import { getAllProductCategoriesReq } from "@/src/services/dashboard/categories/product-categories";
import { getEveryProduct } from "@/src/services/dashboard/products/products";


// Every product, active and inactive, on every page. It used to ask for
// `meta.status=ACTIVE` with no `limit`, so it showed the API's default 10 and
// hid both the rest and every inactive product. Inactive ones carry a badge.
const ApplyProductDiscountPage = async () => {
    const [{ data }, productCategries] = await Promise.all([
        getEveryProduct(),
        getAllProductCategoriesReq(),
    ]);

    return (
        <div>
            <ApplyDecrease products={data} productCategries={productCategries?.data} />
        </div>
    );
};

export default ApplyProductDiscountPage;
