'use client'


import { TMeta } from '@/src/types';
import { IMenu } from '@/src/types/menu.type';
import { motion } from 'framer-motion';
import TitleHeader from '../../TitleHeader/TitleHeader';
import { useTranslation } from '@/src/hooks/use-translation';
import AllFilters from '../../Filtering/AllFilters';
import PaginationComponent from '../../Filtering/PaginationComponent';
import MenuTable from './MenuTable';

interface IProps {
    menusResult: {
        data: IMenu[];
        meta: TMeta;
        success: boolean;
        message: string;
    }
}

const AllMenus = ({ menusResult }: IProps) => {
    const { t } = useTranslation();
    const sortOptions = [
        { label: t("newest_first"), value: "-createdAt" },
        { label: t("oldest_first"), value: "createdAt" },
    ];

    const filterOptions = [
        {
            label: t("order_status"),
            key: "orderStatus",
            placeholder: "Select Status",
            type: "select",
            items: [
                {
                    label: "Pending",
                    value: "pending"
                }
            ]
        },
    ];

    return (
        <div>
            <TitleHeader title={t("all_menus")} subtitle={t("menus_that_are_created")} />

            {/* Filters */}
            <AllFilters
                sortOptions={sortOptions}
                {...(filterOptions && { filterOptions })}
            />

            {/* Order Table */}
            <MenuTable
                menus={menusResult?.data || []}
            />

            {/* Pagination */}
            {!!menusResult?.meta?.totalPage && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="px-4 md:px-6"
                >
                    <PaginationComponent
                        totalPages={menusResult?.meta?.totalPage as number}
                    />
                </motion.div>
            )}
        </div>
    );
};

export default AllMenus;