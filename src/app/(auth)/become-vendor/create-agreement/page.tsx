import CreateVendorAgreement from '@/src/components/BecomeVendor/CreateVendorAgreement';
import { getVendorDetails } from '@/src/services/dashboard/profile/profile.service';
import { getDecodedToken } from '@/src/utils/getDecodedToken';
import { redirect } from 'next/navigation';
import React from 'react';

const VendorAgreementCreatePage = async () => {
    const decoded = await getDecodedToken();

    if (!decoded) {
        redirect("/login");
    }

    const result = await getVendorDetails(decoded?.userId);

    return (
        <div>
            <CreateVendorAgreement vendor={result?.data} />
        </div>
    );
};

export default VendorAgreementCreatePage;