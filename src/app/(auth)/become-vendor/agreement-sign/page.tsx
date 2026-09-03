import AgreementViewer from "@/src/components/BecomeVendor/AgreementViewer";
import { getSingleAgreement } from "@/src/services/becomeVendor/become-vendor";
import { getDecodedToken } from "@/src/utils/getDecodedToken";

interface IProps {
    searchParams: Promise<{ agreementId: string }>;
}

const AgreementSignPage = async ({ searchParams }: IProps) => {
    const agreementId = (await searchParams).agreementId || "";
    const data = await getSingleAgreement(agreementId);
    const decoded = await getDecodedToken();

    return (
        <div>
            <AgreementViewer agreement={data?.data} vendorId={decoded?.userId} />
        </div>
    );
};

export default AgreementSignPage;