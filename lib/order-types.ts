// Shared types & pure utilities — NO "use client" — safe for server (API routes) AND client

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

export const STATUS_WEIGHT: Record<string, number> = {
  "Menunggu Konfirmasi": 1,
  "Dalam Antrian": 2,
  "Sedang Dikerjakan": 3,
  "Review": 4,
  "Review Hasil": 4,
  "Review Pelanggan": 4,
  "Menunggu Pembayaran": 5,
  "Selesai": 6,
  "Ditolak": -1,
};

export function mergeOrders(primary: OrderData[], secondary: OrderData[]): OrderData[] {
  const map = new Map<string, OrderData>();

  const getKey = (o: OrderData) => o.id || o.code || o.officialCode || o.tempCode;

  secondary.forEach((s) => {
    const k = getKey(s);
    if (k) map.set(k, s);
  });

  primary.forEach((p) => {
    const k = getKey(p);
    if (!k) return;

    const s = map.get(k);
    if (!s) {
      map.set(k, p);
    } else {
      const pW = STATUS_WEIGHT[p.status] || 0;
      const sW = STATUS_WEIGHT[s.status] || 0;

      const base = sW >= pW ? { ...p, ...s } : { ...s, ...p };

      const merged: OrderData = {
        ...base,
        id: p.id || s.id,
        code: p.code || s.code,
        tempCode: s.tempCode || p.tempCode || p.code || s.code,
        officialCode: s.officialCode || p.officialCode || base.officialCode,
        reviewStartedAt: s.reviewStartedAt || p.reviewStartedAt || base.reviewStartedAt,
        gdriveReviewUrl: s.gdriveReviewUrl || p.gdriveReviewUrl || base.gdriveReviewUrl,
        gdriveFinalUrl: s.gdriveFinalUrl || p.gdriveFinalUrl || base.gdriveFinalUrl,
        isAccByAdmin: s.isAccByAdmin || p.isAccByAdmin || base.isAccByAdmin,
      };

      map.set(k, merged);
    }
  });

  return Array.from(map.values());
}
