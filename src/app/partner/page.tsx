import { getPartnerPageSummary } from "./_server/getPartnerPageSummary";
import PartnerShell from "./_components/PartnerShell";

export default async function Page() {
	const summary = await getPartnerPageSummary();
	return <PartnerShell summary={summary} />;
}

