import MenuDetails from '@/src/components/Dashboard/Menu/MenuDetails';
import { getAllMenuSection, getSingleMenu } from '@/src/services/dashboard/menu/menu.service';
import { getAllProductsReq } from '@/src/services/dashboard/products/products';
import React from 'react';

interface IProps {
    params: { id: string };
}

const MenuDetailsPage = async ({ params }: IProps) => {
    const { id } = await params;
    const { data } = await getSingleMenu(id);
    const { data: sections } = await getAllMenuSection(id);
    const result = await getAllProductsReq();


    return (
        <div>
            <MenuDetails menu={data} sections={sections} products={result?.data} />
        </div>
    );
};

export default MenuDetailsPage;