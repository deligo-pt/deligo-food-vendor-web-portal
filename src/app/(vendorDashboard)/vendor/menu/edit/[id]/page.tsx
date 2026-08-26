import EditMenu from '@/src/components/Dashboard/Menu/EditMenu';
import { getSingleMenu } from '@/src/services/dashboard/menu/menu.service';
import React from 'react';

interface IProps {
    params: { id: string };
}


const EditMenuPage = async ({ params }: IProps) => {
    const { id } = await params;
    const { data } = await getSingleMenu(id);

    return (
        <div>
            <EditMenu menu={data} />
        </div>
    );
};

export default EditMenuPage;