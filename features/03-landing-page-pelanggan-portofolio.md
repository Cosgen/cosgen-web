# Landing Page Pelanggan & Portofolio

Halaman utama bagi pelanggan yang menampilkan navigasi (Pricelist, Status, Pesan), galeri masonry, slider Before-After, FAQ, dan manajemen konten.

## Spesifikasi

### Tujuan
Memberikan pelanggan akses mudah melihat informasi jasa (portofolio, harga, FAQ) serta navigasi cepat ke pemesanan, pengecekan status, dan kontak, melalui tampilan yang menarik dan konten yang selalu terbarui.

### Selesai bila
- Pengunjung dapat melihat menu navigasi (Pricelist, Cek Status, Pesan) yang berfungsi dan responsif di perangkat seluler maupun desktop.
- Galeri portofolio menampilkan gambar-gambar dalam susunan masonry yang dinamis, termasuk sub-bagian 'Background Premium' yang hanya menampilkan karya tertentu sesuai pengaturan admin.
- Slider Before-After berfungsi dengan baik: pengguna dapat menggeser untuk membandingkan gambar sebelum dan sesudah editing.
- Bagian FAQ menampilkan pertanyaan dalam format akordeon yang bisa dibuka tutup, dan kontennya dapat diperbarui oleh admin melalui dashboard.
- Admin dapat mengelola semua konten yang tampil di landing page (gambar portofolio, slider, FAQ) dari panel manajemen konten, dan perubahan langsung terlihat tanpa perlu menyentuh kode.

## Task

### 1. Buat layout landing page utama dengan navigasi & semua seksi (Hero, Galeri, Compare, FAQ, PriceList) pakai data tiruan

### 2. Kembangkan komponen galeri masonry responsif dengan filter kategori 'Background Premium' pakai gambar tiruan

### 3. Implementasikan komponen slider Before-After pembanding gambar dengan data tiruan

### 4. Buat seksi FAQ akordeon dengan daftar pertanyaan & jawaban tiruan

### 5. Bangun seksi PriceList dengan tombol 'Pesan', modal T&C, dan form multi-step (data pelanggan & proyek) pakai state lokal

### 6. Buat halaman Cek Status dengan status order tiruan, permintaan revisi, info pembayaran, dan link chat

### 7. Bangun halaman dashboard admin untuk manajemen konten (CRUD galeri, FAQ, price list, hero, slider) dengan data tiruan

### 8. Buat skema database Supabase untuk konten landing page (hero, galeri, FAQ, price list, slider) dan migrasi

### 9. Bangun rute API Next.js untuk operasi CRUD konten landing page (galeri, FAQ, price list, hero, slider)

### 10. Implementasikan endpoint upload gambar untuk galeri dan slider

### 11. Hubungkan dashboard admin ke API untuk menyimpan perubahan konten
