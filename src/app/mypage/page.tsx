import { getMyPageSummary } from "./_server/getMyPageSummary";
import MyPageShell from "./_components/MyPageShell";

export default async function Page() {
	const summary = await getMyPageSummary();
	return <MyPageShell summary={summary} />;
}

