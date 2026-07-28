# Manajemen Pesanan & Pelanggan (Dashboard Admin)

Panel admin untuk mengelola pesanan dan data pelanggan, termasuk penolakan, konfirmasi ACC, koreksi data, dan pengaturan T&C.

## Spesifikasi

### Tujuan
Admin dapat mengelola seluruh siklus pesanan dan data pelanggan dari satu panel, termasuk menolak dengan alasan, mengonfirmasi persetujuan pelanggan, mengoreksi data, dan menyesuaikan teks Syarat & Ketentuan.

### Selesai bila
- Admin bisa menolak pesanan dengan mengisi alasan, dan alasan tersebut terlihat oleh pelanggan di halaman Cek Status.
- Admin bisa mengklik tombol konfirmasi yang mengubah status dari Review ke Menunggu Pembayaran, dan membuka tombol bayar di sisi pelanggan.
- Admin dapat mengubah jumlah foto pada pesanan yang sudah ada serta menghapus seluruh data pesanan bila diperlukan.
- Tersedia menu khusus di dashboard untuk mengedit teks Syarat & Ketentuan, dan perubahan langsung tampil di form order pelanggan.

## Sub-fitur: Penolakan Pesanan

Admin wajib mengisi alasan penolakan saat menolak pesanan, dan pelanggan mendapat notifikasi.

### Tujuan
Admin dapat menolak pesanan dengan menyertakan alasan wajib sehingga pelanggan memahami keputusan tersebut.

### Selesai bila
- Saat admin menekan tombol "Tolak" pada detail pesanan, muncul kolom teks wajib berlabel "Alasan Penolakan".
- Status pesanan berubah menjadi "Ditolak" dan alasan tersimpan.
- Halaman Cek Status milik pelanggan menampilkan status "Ditolak" beserta teks alasan yang telah diisi admin.

## Sub-fitur: Konfirmasi ACC Manual

Tombol bagi admin untuk mengonfirmasi pelanggan ACC, mengubah status dari Review ke Menunggu Pembayaran.

### Tujuan
Admin dapat membuka kunci pembayaran dengan mengonfirmasi bahwa pelanggan telah menyetujui hasil review.

### Selesai bila
- Pada pesanan berstatus "Review", terdapat tombol dengan label "Konfirmasi Pelanggan ACC".
- Setelah tombol diklik, status pesanan langsung berubah menjadi "Menunggu Pembayaran" dan tombol tersebut menjadi tidak aktif.
- Di portal pelanggan, tombol "Bayar Sekarang" yang semula terkunci kini aktif dan dapat ditekan.

## Sub-fitur: Koreksi Data

Admin dapat mengedit jumlah foto dan menghapus data pesanan.

### Tujuan
Admin dapat menyesuaikan jumlah foto pada pesanan atau menghapus data pesanan sepenuhnya.

### Selesai bila
- Admin bisa mengedit kolom "Jumlah Foto" di halaman detail pesanan dan menyimpan angka baru.
- Terdapat aksi hapus yang setelah dikonfirmasi menghapus seluruh data pesanan (kode, status, dan berkas terkait) dari sistem.
- Perubahan jumlah foto tercatat tanpa menghilangkan riwayat status pesanan.

## Sub-fitur: Edit T&C

Menu bagi admin untuk mengubah isi teks Syarat & Ketentuan yang muncul di form order.

### Tujuan
Admin dapat mengubah teks Syarat & Ketentuan yang wajib disetujui pelanggan sebelum mengisi form pemesanan.

### Selesai bila
- Dashboard admin memiliki menu "Syarat & Ketentuan" yang menampilkan area editor teks.
- Admin dapat mengetik atau memperbarui isi T&C, lalu menyimpan perubahan.
- Form pemesanan di sisi pelanggan langsung menampilkan teks T&C terbaru setelah admin menyimpan.

## Task

### 1. Buat halaman detail pesanan admin

### 2. Buat modal alasan penolakan

### 3. Buat tombol konfirmasi pelanggan ACC

### 4. Buat form edit jumlah foto

### 5. Buat konfirmasi hapus data pesanan

### 6. Buat halaman editor T&C admin

### 7. Tampilkan status ditolak di halaman cek status

### 8. Aktifkan tombol bayar setelah konfirmasi ACC

### 9. Tampilkan T&C terbaru di form pemesanan

### 10. Buat tabel pesanan dan migrasi

### 11. Buat endpoint tolak pesanan

### 12. Buat endpoint konfirmasi ACC

### 13. Buat endpoint update jumlah foto

### 14. Buat endpoint hapus pesanan

### 15. Buat tabel T&C dan migrasi

### 16. Buat endpoint CRUD T&C

### 17. Buat halaman dashboard admin dengan daftar pesanan dan navigasi

### 18. Buat halaman detail pesanan dengan tampilan data dan tombol aksi sesuai status

### 19. Implementasi popup penolakan pesanan dengan form alasan wajib dan perubahan status lokal

### 20. Implementasi tombol konfirmasi ACC manual dan perubahan status di detail pesanan

### 21. Implementasi edit jumlah foto inline dan tombol hapus pesanan dengan konfirmasi

### 22. Buat halaman Edit T&C di admin dengan textarea dan tombol simpan

### 23. Integrasikan teks T&C dari admin ke komponen Syarat & Ketentuan di form pemesanan

### 24. Desain skema database dan migrasi untuk tabel orders dan terms_conditions

### 25. Buat API endpoint untuk mengambil daftar pesanan dan detail pesanan (admin)

### 26. Buat API endpoint untuk menolak pesanan (update status ke Ditolak dengan alasan)

### 27. Buat API endpoint untuk konfirmasi ACC (ubah status dari Review ke Menunggu Pembayaran)

### 28. Buat API endpoint untuk mengupdate jumlah foto dan menghapus pesanan (soft delete)

### 29. Buat API endpoint untuk mengambil dan menyimpan teks Syarat & Ketentuan
