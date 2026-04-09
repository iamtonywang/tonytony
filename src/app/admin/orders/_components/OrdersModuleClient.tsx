"use client";

import { useState } from "react";

import OrderDetail from "./OrderDetail";
import OrderList from "./OrderList";

export default function OrdersModuleClient() {
	const [selectedOrderNumber, setSelectedOrderNumber] = useState<string | null>(null);

	return (
		<div style={{ display: "grid", gap: 20 }}>
			<OrderList selectedOrderNumber={selectedOrderNumber} onSelectOrderNumber={setSelectedOrderNumber} />
			<OrderDetail orderNumber={selectedOrderNumber} />
		</div>
	);
}
