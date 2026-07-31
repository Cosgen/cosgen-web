"use client";

// Re-export shared types & utilities from server-safe file
export type { OrderData } from "./order-types";
export { INITIAL_SHARED_ORDERS, STATUS_WEIGHT, mergeOrders } from "./order-types";

import { OrderData, mergeOrders, INITIAL_SHARED_ORDERS } from "./order-types";

// Fetch latest global orders from server API (Supabase) and merge safely with local
export async function syncGlobalOrdersFromServer(): Promise<OrderData[]> {
  try {
    const res = await fetch(`/api/orders?t=${Date.now()}_${Math.random()}`, {
      cache: "no-store",
      headers: { "Cache-Control": "no-cache", "Pragma": "no-cache" },
    });
    if (res.ok) {
      const data = await res.json();
      if (data.orders && Array.isArray(data.orders)) {
        const localOrders = getStoredOrders();

        // Permanently safe merge — NEVER expire or purge orders by timer!
        const merged = mergeOrders(data.orders, localOrders);
        if (typeof window !== "undefined") {
          localStorage.setItem("cosgen_admin_orders", JSON.stringify(merged));
          window.dispatchEvent(new Event("cosgen_orders_updated"));
        }

        // Auto-push merged result to server if local has new orders
        if (localOrders.length > 0) {
          fetch("/api/orders", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "sync", orders: merged }),
          }).catch(() => {});
        }

        return merged;
      }
    }
  } catch (err) {
    console.warn("Failed to sync orders from server:", err);
  }
  return getStoredOrders();
}

export function getStoredOrders(): OrderData[] {
  if (typeof window === "undefined") return INITIAL_SHARED_ORDERS;
  try {
    const raw = localStorage.getItem("cosgen_admin_orders");
    if (!raw) {
      localStorage.setItem("cosgen_admin_orders", JSON.stringify(INITIAL_SHARED_ORDERS));
      return INITIAL_SHARED_ORDERS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : INITIAL_SHARED_ORDERS;
  } catch {
    return INITIAL_SHARED_ORDERS;
  }
}

export function saveOrdersToStorage(orders: OrderData[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem("cosgen_admin_orders", JSON.stringify(orders));
  window.dispatchEvent(new Event("cosgen_orders_updated"));

  // MANDATORY SERVER SYNC: Automatically upload to server API & Supabase so HP & Desktop sync instantly!
  fetch("/api/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "sync", orders }),
  }).catch((err) => console.warn("Background server sync notice:", err));
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
  const existing = current.find(
    (o) =>
      o.id === orderId ||
      o.code === orderId ||
      (o.officialCode && o.officialCode === orderId) ||
      (o.tempCode && o.tempCode === orderId)
  );

  const isReviewStatus =
    partial.status === "Review" ||
    partial.status === "Review Hasil" ||
    partial.status === "Review Pelanggan";

  if (isReviewStatus) {
    if (!partial.reviewStartedAt && (!existing || !existing.reviewStartedAt)) {
      partial.reviewStartedAt = new Date().toISOString();
    }
  }

  const updated = current.map((o) => {
    if (
      o.id === orderId ||
      o.code === orderId ||
      (o.officialCode && o.officialCode === orderId) ||
      (o.tempCode && o.tempCode === orderId)
    ) {
      return { ...o, ...partial };
    }
    return o;
  });

  saveOrdersToStorage(updated);

  try {
    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "update", orderId, partial }),
    });

    if (res.ok) {
      const json = await res.json();
      if (json.orders && Array.isArray(json.orders)) {
        const merged = mergeOrders(json.orders, updated);
        saveOrdersToStorage(merged);
        return merged.find(
          (o) =>
            o.id === orderId ||
            o.code === orderId ||
            (o.officialCode && o.officialCode === orderId)
        );
      }
    }
  } catch (err) {
    console.error("Failed to update order on server API:", err);
  }

  return updated.find(
    (o) =>
      o.id === orderId ||
      o.code === orderId ||
      (o.officialCode && o.officialCode === orderId)
  );
}

export async function deleteSingleOrder(orderId: string) {
  const current = getStoredOrders();
  const updated = current.filter(
    (o) =>
      o.id !== orderId &&
      o.code !== orderId &&
      (o.officialCode ? o.officialCode !== orderId : true) &&
      (o.tempCode ? o.tempCode !== orderId : true)
  );
  saveOrdersToStorage(updated);

  try {
    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "delete", orderId }),
    });

    if (res.ok) {
      const json = await res.json();
      if (json.orders && Array.isArray(json.orders)) {
        saveOrdersToStorage(json.orders);
      }
    }
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
