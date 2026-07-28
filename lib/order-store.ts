"use client";

export interface OrderData {
  id: string;
  code: string;
  officialCode?: string;
  tempCode?: string;
  customerName: string;
  whatsapp: string;
  instagram: string;
  package: string;
  photoCount: number;
  totalAmount: number;
  status:
    | "Menunggu Konfirmasi"
    | "Dalam Antrian"
    | "Sedang Dikerjakan"
    | "Review"
    | "Menunggu Pembayaran"
    | "Selesai"
    | "Ditolak";
  isAccByAdmin?: boolean;
  rejectionReason?: string;
  customerGdriveUrl?: string;
  gdriveReviewUrl?: string;
  gdriveFinalUrl?: string;
  subStatus?: string;
  briefText?: string;
  createdAt: string;
}

// Clear all dummy/sample orders — start completely blank from scratch
export const INITIAL_SHARED_ORDERS: OrderData[] = [];

export function getStoredOrders(): OrderData[] {
  if (typeof window === "undefined") return INITIAL_SHARED_ORDERS;
  const saved = localStorage.getItem("cosgen_admin_orders");
  if (!saved) {
    localStorage.setItem("cosgen_admin_orders", JSON.stringify(INITIAL_SHARED_ORDERS));
    return INITIAL_SHARED_ORDERS;
  }
  try {
    return JSON.parse(saved);
  } catch (e) {
    console.error(e);
    return INITIAL_SHARED_ORDERS;
  }
}

export function saveOrdersToStorage(orders: OrderData[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem("cosgen_admin_orders", JSON.stringify(orders));
  // Dispatch custom storage event for instant tab sync
  window.dispatchEvent(new Event("cosgen_orders_updated"));
}

export function updateSingleOrder(orderId: string, partial: Partial<OrderData>) {
  const current = getStoredOrders();
  const updated = current.map((o) => (o.id === orderId ? { ...o, ...partial } : o));
  saveOrdersToStorage(updated);
  return updated.find((o) => o.id === orderId);
}

export function clearAllOrders() {
  if (typeof window === "undefined") return;
  localStorage.setItem("cosgen_admin_orders", JSON.stringify([]));
  window.dispatchEvent(new Event("cosgen_orders_updated"));
}
