import ApplyIncrease from '@/src/components/Dashboard/Products/ApplyIncrease/ApplyIncrease';
import { getAllProductCategoriesReq } from '@/src/services/dashboard/categories/product-categories';
import { getEveryProduct } from '@/src/services/dashboard/products/products';
import React from 'react';

// Every product, active and inactive, on every page. It used to ask for
// `meta.status=ACTIVE` with no `limit`, so it showed the API's default 10 and
// hid both the rest and every inactive product. Inactive ones carry a badge.
const ApplyProductIncreasePage = async () => {
    const [{ data }, productCategries] = await Promise.all([
        getEveryProduct(),
        getAllProductCategoriesReq(),
    ]);

    return (
        <div>
            <ApplyIncrease products={data}
                productCategries={productCategries?.data} />
        </div>
    );
};

export default ApplyProductIncreasePage;
