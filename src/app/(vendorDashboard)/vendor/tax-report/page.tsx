import TaxReport from "@/src/components/Dashboard/Reports/TaxReport/TaxReport";
import { getTaxReport } from "@/src/services/dashboard/report/tax-report.service";

export default async function TaxReportPage() {
  const taxReportData = await getTaxReport();

  return <TaxReport taxReportData={taxReportData} />;
}
