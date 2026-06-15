import AllSosAlerts from "@/src/components/Dashboard/SOS/AllSosAlerts";
import { getAllSosAlerts } from "@/src/services/dashboard/SOS/SOS";
import { TSosResponse } from "@/src/types/sos.type";
import { queryStringFormatter } from "@/src/utils/formatter";


type IProps = {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
};

const AllSosAlertPage = async ({ searchParams }: IProps) => {
    const params = await searchParams;
    const queryString = queryStringFormatter(params);
    const sosAlerts = await getAllSosAlerts(queryString) as unknown as TSosResponse;

    return (
        <div>
            <AllSosAlerts sosAlerts={sosAlerts} />
        </div>
    );
};

export default AllSosAlertPage;