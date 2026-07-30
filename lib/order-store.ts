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
    | "Review Hasil"
    | "Review Pelanggan"
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
  reviewStartedAt?: string;
  createdAt: string;
}

export const INITIAL_SHARED_ORDERS: OrderData[] = [];

// Helper to merge two lists of orders cleanly without duplicates
export function mergeOrders(primary: OrderData[], secondary: OrderData[]): OrderData[] {
  const map = new Map<string, OrderData>();
  
  // Add primary (server) orders first
  primary.forEach((o) => {
    if (o.id) map.set(o.id, o);
  });

  // Add secondary (local) orders if not present
  secondary.forEach((o) => {
    if (o.id && !map.has(o.id)) {
      map.set(o.id, o);
    }
  });

  return Array.from(map.values());
}

// Fetch latest global orders from server API (Supabase) and merge with local
export async function syncGlobalOrdersFromServer(): Promise<OrderData[]> {
  const localOrders = getStoredOrders();
  try {
    const res = await fetch("/api/orders", { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      if (data.orders && Array.isArray(data.orders)) {
        const merged = mergeOrders(data.orders, localOrders);
        if (typeof window !== "undefined") {
          localStorage.setItem("cosgen_admin_orders", JSON.stringify(merged));
          window.dispatchEvent(new Event("cosgen_orders_updated"));
        }
        return merged;
      }
    }
  } catch (err) {
    console.warn("Global order sync warning:", err);
  }
  return localOrders;
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
}

export async function saveNewSingleOrder(newOrder: OrderData): Promise<OrderData[]> {
  const current = getStoredOrders();
  const exists = current.some((o) => o.id === newOrder.id || o.code === newOrder.code);
  const updated = exists ? current : [newOrder, ...current];
  saveOrdersToStorage(updated);

  try {
    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "create", order: newOrder }),
    });

    if (res.ok) {
      const json = await res.json();
      if (json.orders && Array.isArray(json.orders)) {
        const merged = mergeOrders(json.orders, updated);
        saveOrdersToStorage(merged);
        return merged;
      }
    }
  } catch (err) {
    console.error("Failed to save order to global server API:", err);
  }

  return updated;
}

export async function updateSingleOrder(orderId: string, partial: Partial<OrderData>) {
  const current = getStoredOrders();
  const updated = current.map((o) => (o.id === orderId ? { ...o, ...partial } : o));
  saveOrdersToStorage(updated);

  try {
    await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "update", orderId, partial }),
    });
  } catch (err) {
    console.error("Failed to update order on server API:", err);
  }

  return updated.find((o) => o.id === orderId);
}

export async function deleteSingleOrder(orderId: string) {
  const current = getStoredOrders();
  const updated = current.filter((o) => o.id !== orderId);
  saveOrdersToStorage(updated);

  try {
    await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "delete", orderId }),
    });
  } catch (err) {
    console.error("Failed to delete order on server API:", err);
  }
}

export async function clearAllOrders() {
  if (typeof window === "undefined") return;
  localStorage.setItem("cosgen_admin_orders", JSON.stringify([]));
  window.dispatchEvent(new Event("cosgen_orders_updated"));

  try {
    await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "clear" }),
    });
  } catch (err) {
    console.error("Failed to clear orders on server API:", err);
  }
}
