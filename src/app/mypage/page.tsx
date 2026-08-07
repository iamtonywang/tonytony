import SignatureLine from "@/components/sections/SignatureLine";
import { getMyPageSummary } from "./_server/getMyPageSummary";
import MyPageShell from "./_components/MyPageShell";

export default async function Page() {
	const summary = await getMyPageSummary();
	return (
		<>
			<SignatureLine />
			<MyPageShell summary={summary} />
			<SignatureLine />
		</>
	);
}
