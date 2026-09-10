'use client';
import { Button } from '@/components/ui/button';
import AgreementViewer from '@/src/components/BecomeVendor/AgreementViewer';
import TitleHeader from '@/src/components/TitleHeader/TitleHeader';
import { useTranslation } from '@/src/hooks/use-translation';
import { IAgreement } from '@/src/types/agreement.type';
import { useRouter } from 'next/navigation';

interface IProps {
    agreement: IAgreement;
    vendorId: string;
}

const Re_SignAgreement = ({ agreement, vendorId }: IProps) => {
    const { t } = useTranslation();
    const router = useRouter();

    return (
        <div>
            {/* Page Title */}
            <TitleHeader title={t("re_sign_agreement")} subtitle={t("review_nd_sign_the_agreement_below")} />
            {
                !agreement?.status ? (
                    <div className='flex flex-col justify-center items-center'>
                        <p className='text-xl mb-3'>{t("agreement_signed_successfully")}</p>
                        <Button type="button" className="bg-[#DC3173] text-white" variant="link" onClick={() => router.push("/vendor/dashboard")}>
                            {t("goBack")}
                        </Button>
                    </div>
                ) : (

                    <AgreementViewer agreement={agreement} vendorId={vendorId} type="re-sign" />
                )
            }
        </div>
    );
};

export default Re_SignAgreement;