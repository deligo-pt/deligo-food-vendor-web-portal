"use client";
import TitleHeader from '../../TitleHeader/TitleHeader';
import { useTranslation } from '@/src/hooks/use-translation';
import AllFilters from '../../Filtering/AllFilters';
import BranchTable from './BranchTable';
import { TVendor } from '@/src/types/vendor.type';

const AllBranches = ({ branches }: { branches: TVendor[] }) => {
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
                branches={branches || []}
            />

        </div>
    );
};

export default AllBranches;