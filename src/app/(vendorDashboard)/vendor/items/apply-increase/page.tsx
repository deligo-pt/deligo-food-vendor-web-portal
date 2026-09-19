import ApplyIncrease from '@/src/components/Dashboard/Products/ApplyIncrease/ApplyIncrease';
import { getAllProductCategoriesReq } from '@/src/services/dashboard/categories/product-categories';
import { getAllProducts } from '@/src/services/dashboard/products/products';
import { queryStringFormatter } from '@/src/utils/formatter';
import React from 'react';

const ApplyProductIncreasePage = async () => {
    const query = { "meta.status": "ACTIVE" };
    const queryString = queryStringFormatter(query);
    const { data } = await getAllProducts(queryString);
    const productCategries = await getAllProductCategoriesReq();

    return (
        <div>
            <ApplyIncrease products={data}
                productCategries={productCategries?.data} />
        </div>
    );
};

export default ApplyProductIncreasePage;