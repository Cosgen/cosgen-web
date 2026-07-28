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

export const INITIAL_SHARED_ORDERS: OrderData[] = [];

// Fetch latest global orders from server API
export async function syncGlobalOrdersFromServer(): Promise<OrderData[]> {
  try {
    const res = await fetch("/api/orders", { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      if (data.orders && Array.isArray(data.orders)) {
        if (typeof window !== "undefined") {
          localStorage.setItem("cosgen_admin_orders", JSON.stringify(data.orders));
          window.dispatchEvent(new Event("cosgen_orders_updated"));
        }
        return data.orders;
      }
    }
  } catch (err) {
    console.warn("Global order sync warning:", err);
  }
  return getStoredOrders();
}

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
  window.dispatchEvent(new Event("cosgen_orders_updated"));

  // Send to global server API for multi-client sync
  try {
    fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "sync", orders }),
    }).catch(() => {});
  } catch {}
}

export function saveNewSingleOrder(newOrder: OrderData) {
  const current = getStoredOrders();
  const updated = [newOrder, ...current];
  saveOrdersToStorage(updated);

  try {
    fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "create", order: newOrder }),
    }).catch(() => {});
  } catch {}
}

export function updateSingleOrder(orderId: string, partial: Partial<OrderData>) {
  const current = getStoredOrders();
  const updated = current.map((o) => (o.id === orderId ? { ...o, ...partial } : o));
  saveOrdersToStorage(updated);

  try {
    fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "update", orderId, partial }),
    }).catch(() => {});
  } catch {}

  return updated.find((o) => o.id === orderId);
}

export function clearAllOrders() {
  if (typeof window === "undefined") return;
  localStorage.setItem("cosgen_admin_orders", JSON.stringify([]));
  window.dispatchEvent(new Event("cosgen_orders_updated"));

  try {
    fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "clear" }),
    }).catch(() => {});
  } catch {}
}
