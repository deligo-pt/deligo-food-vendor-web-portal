import { serverRequest } from "@/lib/serverFetch";
import Profile from "@/src/components/Profile/Profile";
import { getAgreementHistory } from "@/src/services/becomeVendor/become-vendor";
import { IAgreementsResponse } from "@/src/types/agreement.type";
import { TVendor } from "@/src/types/vendor.type";
import { queryStringFormatter } from "@/src/utils/formatter";
import { isRedirectError } from "next/dist/client/components/redirect-error";

type IProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
};

const ProfilePage = async ({ searchParams }: IProps) => {
  const params = await searchParams;
  let vendorData: TVendor = {} as TVendor;

  try {
    const result = await serverRequest.get("/profile");

    if (result?.success) {
      vendorData = result?.data;
    }
  } catch (err) {
    console.log("Server fetch error:", err);
    if (isRedirectError(err)) throw err;
  }

  const queryString = queryStringFormatter(params);
  const agreementsData = await getAgreementHistory(vendorData?.userId, queryString);

  return <Profile vendor={vendorData} agreementsData={agreementsData as IAgreementsResponse} />;
}


export default ProfilePage;