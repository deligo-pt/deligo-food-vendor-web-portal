"use client";
import TitleHeader from '../../TitleHeader/TitleHeader';
import { useTranslation } from '@/src/hooks/use-translation';
import AllFilters from '../../Filtering/AllFilters';
import BranchTable from './BranchTable';
import { TVendor } from '@/src/types/vendor.type';
import { TMeta } from '@/src/types';
import { motion } from 'framer-motion';
import PaginationComponent from '../../Filtering/PaginationComponent';

interface IProps {
    branches: {
        data: TVendor[];
        meta: TMeta;
    }
}

const AllBranches = ({ branches }: IProps) => {
    const { t } = useTranslation();
    const sortOptions = [
        { label: t("newest_first"), value: "-createdAt" },
        { label: t("oldest_first"), value: "createdAt" },
    ];


    return (
        <div className="space-y-6 max-w-full">
            {/* Page Title */}
            <TitleHeader title={t("all_branches")} subtitle={t("all_branches_of_your_brand")} />

            {/* Filters */}
            <AllFilters
                sortOptions={sortOptions}
            // {...(showFilters && { filterOptions })}
            />

            {/* Order Table */}
            <BranchTable
                branches={branches?.data || []}
            />


            {/* Pagination */}
            {!!branches?.meta?.totalPage && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="px-4 md:px-6"
                >
                    <PaginationComponent
                        totalPages={branches?.meta?.totalPage as number}
                    />
                </motion.div>
            )}

        </div>
    );
};

export default AllBranches;