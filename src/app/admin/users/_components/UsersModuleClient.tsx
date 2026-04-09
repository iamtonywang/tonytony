"use client";

import { useState } from "react";

import UserDetail from "./UserDetail";
import UserList from "./UserList";

export default function UsersModuleClient() {
	const [selectedLoginId, setSelectedLoginId] = useState<string | null>(null);

	return (
		<div style={{ display: "grid", gap: 20 }}>
			<UserList selectedLoginId={selectedLoginId} onSelectLoginId={setSelectedLoginId} />
			<UserDetail loginId={selectedLoginId} />
		</div>
	);
}
