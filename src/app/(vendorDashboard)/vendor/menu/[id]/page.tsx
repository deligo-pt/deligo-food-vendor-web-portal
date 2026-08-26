import MenuDetails from '@/src/components/Dashboard/Menu/MenuDetails';
import { getSingleMenu } from '@/src/services/dashboard/menu/menu.service';
import React from 'react';

interface IProps {
    params: { id: string };
}

const MenuDetailsPage = async ({ params }: IProps) => {
    const { id } = await params;
    const { data } = await getSingleMenu(id);

    return (
        <div>
            <MenuDetails menu={data} />
        </div>
    );
};

export default MenuDetailsPage;