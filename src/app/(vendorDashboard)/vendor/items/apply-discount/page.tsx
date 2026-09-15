import ApplyDiscount from "@/src/components/Dashboard/Products/ApplyDiscount/ApplyDiscount";
import { getAllProductCategoriesReq } from "@/src/services/dashboard/categories/product-categories";
import { getAllProducts } from "@/src/services/dashboard/products/products";


const ApplyProductDiscountPage = async () => {
    const { data } = await getAllProducts();
    const productCategries = await getAllProductCategoriesReq();

    return (
        <div>
            <ApplyDiscount products={data} productCategries={productCategries?.data} />
        </div>
    );
};

export default ApplyProductDiscountPage;