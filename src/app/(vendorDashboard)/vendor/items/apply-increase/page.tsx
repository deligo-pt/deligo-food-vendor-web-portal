import ApplyIncrease from '@/src/components/Dashboard/Products/ApplyIncrease/ApplyIncrease';
import { getAllProductCategoriesReq } from '@/src/services/dashboard/categories/product-categories';
import { getAllProducts } from '@/src/services/dashboard/products/products';
import React from 'react';

const ApplyProductIncreasePage = async () => {
    const { data } = await getAllProducts();
    const productCategries = await getAllProductCategoriesReq();

    return (
        <div>
            <ApplyIncrease products={data}
                productCategries={productCategries?.data} />
        </div>
    );
};

export default ApplyProductIncreasePage;