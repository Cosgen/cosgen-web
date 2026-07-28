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

export const INITIAL_SHARED_ORDERS: OrderData[] = [
  {
    id: "ord-1",
    code: "REQ-8942",
    tempCode: "REQ-8942",
    customerName: "Aria Pratama",
    whatsapp: "085183016367",
    instagram: "@aria_cos",
    package: "Pertamax",
    photoCount: 2,
    totalAmount: 650000,
    status: "Menunggu Konfirmasi",
    customerGdriveUrl: "https://drive.google.com/drive/folders/cosplay-raw-photos-aria-sample",
    briefText: "Karakter: Raiden Shogun (Genshin Impact). Tolong buat efek aura petir berwarna ungu berkilau di pedang.",
    createdAt: "2026-07-27 10:15",
  },
  {
    id: "ord-2",
    code: "ORD-3301",
    officialCode: "ORD-3301",
    tempCode: "REQ-1204",
    customerName: "Budi Santoso",
    whatsapp: "08123456789",
    instagram: "@budi_cosplay",
    package: "Pertalite",
    photoCount: 1,
    totalAmount: 350000,
    status: "Sedang Dikerjakan",
    customerGdriveUrl: "https://drive.google.com/drive/folders/cosplay-raw-photos-budi-sample",
    subStatus: "Phase: Retouch Wajah & Color Grading",
    briefText: "Karakter: Kaeya (Genshin Impact). Retouch wajah dan penyesuaian warna latar perbukitan es.",
    createdAt: "2026-07-26 14:20",
  },
  {
    id: "ord-3",
    code: "ORD-3302",
    officialCode: "ORD-3302",
    tempCode: "REQ-5512",
    customerName: "Citra Dewi",
    whatsapp: "08987654321",
    instagram: "@citra_vfx",
    package: "Pertamax Turbo",
    photoCount: 3,
    totalAmount: 1200000,
    status: "Review",
    isAccByAdmin: false,
    customerGdriveUrl: "https://drive.google.com/drive/folders/cosplay-raw-photos-citra-sample",
    gdriveReviewUrl: "https://drive.google.com/drive/folders/cosgen-review-citra-sample",
    subStatus: "Phase: Blending Lighting CGI",
    briefText: "Karakter: Kafka (Honkai Star Rail). Efek benang sihir merah dan latar kota cyberpunk malam hari.",
    createdAt: "2026-07-25 09:30",
  },
  {
    id: "ord-4",
    code: "ORD-3303",
    officialCode: "ORD-3303",
    tempCode: "REQ-9901",
    customerName: "Dedi Kurniawan",
    whatsapp: "087711223344",
    instagram: "@dedi_hero",
    package: "Pertamax",
    photoCount: 2,
    totalAmount: 650000,
    status: "Selesai",
    isAccByAdmin: true,
    customerGdriveUrl: "https://drive.google.com/drive/folders/cosplay-raw-photos-dedi-sample",
    gdriveFinalUrl: "https://drive.google.com/drive/folders/cosgen-final-dedi-sample",
    briefText: "Karakter: Saber Excalibur (Fate/Stay Night). Pedang menyala emas dan lingkungan reruntuhan kastil.",
    createdAt: "2026-07-24 16:45",
  },
  {
    id: "ord-5",
    code: "REQ-4410",
    tempCode: "REQ-4410",
    customerName: "Eka Putri",
    whatsapp: "081999888777",
    instagram: "@eka_coser",
    package: "Pertalite",
    photoCount: 1,
    totalAmount: 350000,
    status: "Ditolak",
    isAccByAdmin: false,
    rejectionReason: "Foto mentah beresolusi terlalu rendah (di bawah 1000px) dan gelap ekstrem.",
    briefText: "Karakter: Nezuko (Demon Slayer).",
    createdAt: "2026-07-27 11:00",
  },
];

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
