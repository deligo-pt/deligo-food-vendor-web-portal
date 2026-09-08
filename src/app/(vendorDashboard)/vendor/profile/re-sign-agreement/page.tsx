import Re_SignAgreement from '@/src/components/Profile/Re-SignAgreement';
import { getCurrentAgreementVersion } from '@/src/services/becomeVendor/become-vendor';
import { getDecodedToken } from '@/src/utils/getDecodedToken';

const Re_SignAgreementPage = async () => {
    const { data } = await getCurrentAgreementVersion();
    const decoded = await getDecodedToken();

    return (
        <div>
            <Re_SignAgreement agreement={data} vendorId={decoded?.userId as string} />
        </div>
    );
};

export default Re_SignAgreementPage;