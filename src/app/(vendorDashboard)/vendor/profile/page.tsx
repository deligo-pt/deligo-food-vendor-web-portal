
import Profile from "@/src/components/Profile/Profile";
import { getAgreementHistory, getCurrentAgreementVersion } from "@/src/services/becomeVendor/become-vendor";
import { getVendorDetails } from "@/src/services/dashboard/profile/profile.service";
import { IAgreementsResponse } from "@/src/types/agreement.type";
import { queryStringFormatter } from "@/src/utils/formatter";
import { getDecodedToken } from "@/src/utils/getDecodedToken";

type IProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
};

const ProfilePage = async ({ searchParams }: IProps) => {
  const params = await searchParams;
  const decoded = await getDecodedToken();

  const result = await getVendorDetails(decoded?.userId as string);
  const queryString = queryStringFormatter(params);
  const agreementsData = await getAgreementHistory(decoded?.userId as string, queryString);
  const currentAgreVersion = await getCurrentAgreementVersion();

  return <Profile vendor={result?.data} agreementsData={agreementsData as IAgreementsResponse} currentAgreement={currentAgreVersion?.data} />;
}


export default ProfilePage;