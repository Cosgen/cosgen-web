# 🚀 PROJECT HANDOVER & BACKUP DOCUMENTATION
**Project**: CosGen Web App SaaS (`cosgen-web`)
**Domain**: `https://www.cosgen.web.id` / `https://cosgen-web.vercel.app`
**Date**: July 31, 2026

---

## 🔑 1. Quick Access Credentials & Configuration
- **Admin Portal**: `https://www.cosgen.web.id/admin/login`
- **Admin Email**: `admin@cosgen.id`
- **Admin Password**: `admin123`
- **Default Theme**: Light Mode (`components/theme-provider.tsx` `defaultTheme="light"`)
- **Domain DNS**: Registered via IDwebhost, pointing to Vercel DNS (`76.76.21.21` A-record & `cname.vercel-dns.com` CNAME).

---

## 🏗️ 2. Core Technical Architecture & Data Flow

### A. Order Data Store (`lib/order-store.ts`)
- **Primary Type**: `OrderData` (includes `id`, `code`, `officialCode`, `tempCode`, `customerName`, `whatsapp`, `instagram`, `package`, `photoCount`, `totalAmount`, `status`, `isAccByAdmin`, `gdriveReviewUrl`, `gdriveFinalUrl`, `reviewStartedAt`, `createdAt`).
- **LocalStorage Key**: `"cosgen_admin_orders"`
- **Event Bus**: Custom `Event("cosgen_orders_updated")` & `window.addEventListener("storage")` trigger real-time UI updates across components.
- **Merge Logic**: `mergeOrders(primary, secondary)` merges server & local orders without purging by timer. Status progression weight ensures higher status updates take precedence.

### B. Global Server API Routes (`/api/orders` & `/api/scheduler`)
- **No-Cache Directives**:
  ```ts
  export const dynamic = "force-dynamic";
  export const revalidate = 0;
  export const fetchCache = "force-no-store";
  ```
  HTTP Headers: `Cache-Control: no-store, no-cache, must-revalidate, max-age=0, s-maxage=0`
- **Supabase Integration**:
  - `getSupabaseClient()` connects using `process.env` or hardcoded fallback credentials (`NEXT_PUBLIC_SUPABASE_URL` & `SUPABASE_SERVICE_ROLE_KEY`).
  - **Dual Storage Strategy**: Writes to individual Supabase table rows AND Master KV Backup row (`id: "_global_all_orders"` in table `orders`).
- **Auto-Sync Mechanism**: `saveOrdersToStorage()` automatically posts to `/api/orders` with `action: "sync"`.

### C. Admin Scheduler & Slot Quota (`app/admin/scheduler/page.tsx`)
- **State Separation**: Top display shows active saved `totalSlots` (`5 Slot`). Bottom form input manages `newSlotInput` and updates on **"Simpan Pengaturan"** submit.
- **Cumulative Photo Count**: `usedSlots` calculates cumulative sum of `photoCount` across all non-rejected orders (`status !== "Ditolak"`).

### D. Order Verification (`app/cek-status/page.tsx`)
- **Flexible Matching**: `matchOrder(o, q)` matches on `code` (`REQ-XXXX`), `officialCode` (`ORD-XXXX`), `tempCode`, `id`, `customerName`, and `whatsapp` digits.
- **Result GDrive Links**: Status `"Selesai"` renders green download button using fallback `gdriveFinalUrl || gdriveReviewUrl || customerGdriveUrl`.

---

## 🌿 3. Git Branches & Status
- **Main Deployment Branch**: `main` (pushed to `origin/main` for Vercel production auto-build).
- **Feature Development Branch**: `feature/touchflow-redesign` (fully synced & fast-forwarded with `main`).
- **Working Tree**: Clean (`nothing to commit, working tree clean`).

---

## 📝 4. Instructions for Next Agent (Claude)
1. Read `HANDOVER_NOTES.md` and `lib/order-store.ts` to understand state management.
2. Run `npm run build` to verify Turbo compilation before any release.
3. Keep `export const dynamic = "force-dynamic"` on API routes to ensure Vercel Edge CDN does not cache API responses.
4. Maintain `code: "REQ-XXXX"` intact when approving orders in `app/admin/pesanan/[id]/page.tsx` (save official code into `officialCode`).
