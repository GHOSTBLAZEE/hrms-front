import PayslipViewerPage from "./PayslipViewer";


export default async function Page({ params }) {
  const { payslipId } = await params;

  return <PayslipViewerPage payslipId={payslipId} />;
}
