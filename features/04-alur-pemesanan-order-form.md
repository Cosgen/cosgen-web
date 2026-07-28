# Alur Pemesanan (Order Form)

Proses pemesanan yang mencakup pengecekan sisa slot, persetujuan T&C, dan formulir multi-langkah.

## Spesifikasi

### Tujuan
Memungkinkan pelanggan melakukan pemesanan dengan memeriksa ketersediaan slot, menyetujui Syarat & Ketentuan, lalu mengisi data secara bertahap agar pesanannya tercatat dan diproses.

### Selesai bila
- Sebelum form muncul, pelanggan melihat jumlah sisa slot bulan ini. Jika slot habis, muncul pesan jelas bahwa pemesanan tidak bisa dilanjutkan.
- Pelanggan wajib membaca dan mencentang persetujuan T&C sebelum bisa melanjutkan ke tahap pengisian data.
- Form terdiri dari dua tahap: Tahap 1 (Nama Panggilan, Nomor WhatsApp, Instagram) dan Tahap 2 (Karakter, Brief, Jumlah Foto, Upload Referensi, Kode Promo) dengan tombol ‘+’ yang dapat menambah kelompok input Karakter, Brief, dan Jumlah Foto secara langsung.
- Setelah semua data diisi dan tombol ‘Kirim’ ditekan, sistem menampilkan halaman konfirmasi dengan kode sementara REQ-XXXX dan status ‘Menunggu Konfirmasi’.
- Upload foto referensi maksimal 6 file dengan indikator sukses/gagal yang jelas.

## Sub-fitur: Sistem Penomoran Kode

Menetapkan kode awal REQ-XXXX saat submit dan kode antrian ORD-XXXX setelah disetujui.

### Tujuan
Menetapkan kode unik pelacakan agar pelanggan dapat memantau progres pesanannya: kode awal REQ-XXXX saat pertama kali dikirim, dan kode resmi ORD-XXXX setelah admin menyetujui.

### Selesai bila
- Segera setelah pelanggan selesai mengirim form, muncul kode dengan format REQ-XXXX (misal REQ-0005) di layar konfirmasi dan tersimpan otomatis.
- Ketika admin menekan ‘Setujui’ di dashboard, kode yang sama berubah menjadi ORD-XXXX dengan nomor antrian baru (misal ORD-0003) di semua tampilan—halaman Cek Status pelanggan dan dashboard admin.
- Pelanggan dapat memasukkan kode REQ-XXXX atau ORD-XXXX di halaman Cek Status untuk melihat detail terbaru, dan sistem mengenali keduanya sebagai pesanan yang sama.

## Task

### 1. Buat halaman /order dengan kerangka multi-langkah dan data tiruan

### 2. Tambahkan komponen cek slot ketersediaan di halaman order

### 3. Implementasi modal persetujuan Syarat dan Ketentuan

### 4. Buat form Tahap 1: data pelanggan

### 5. Buat form Tahap 2: detail pesanan dan unggah referensi

### 6. Implementasi logika pengiriman form dan tampilan kode REQ tiruan

### 7. Inisialisasi Supabase dan siapkan koneksi database

### 8. Buat skema tabel orders beserta migrasi di Supabase

### 9. Buat service penomoran kode pesanan (REQ-XXXX, ORD-XXXX)

### 10. Buat endpoint API POST /api/orders untuk submit pesanan

### 11. Buat endpoint API GET /api/slots untuk cek ketersediaan slot bulan ini

### 12. Buat endpoint API unggah file referensi ke Supabase Storage

### 13. Buat endpoint API PATCH /api/admin/orders/:id/approve untuk approval admin
