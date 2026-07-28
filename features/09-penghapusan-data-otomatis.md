# Penghapusan Data Otomatis

Foto referensi yang diunggah ke Cloudinary dihapus secara otomatis 2x24 jam setelah status pesanan Selesai.

## Spesifikasi

### Tujuan
Sistem secara otomatis menghapus semua foto referensi pelanggan yang telah diunggah, setelah pesanan benar‑benar selesai, untuk menjaga kerapihan penyimpanan dan melindungi privasi data tanpa campur tangan manual.

### Selesai bila
- Begitu status pesanan berubah menjadi **Selesai**, sistem memulai hitung mundur 2×24 jam dan menampilkan informasi sisa waktu (misalnya “Foto referensi akan dihapus otomatis dalam 1 hari 23 jam”) di halaman detail pesanan (baik sisi admin maupun pelanggan).
- Tepat setelah 2×24 jam berlalu, semua file foto referensi milik pesanan tersebut terhapus secara permanen dari penyimpanan dan tidak dapat diakses lagi melalui pranala mana pun.
- Admin tidak perlu melakukan penghapusan manual; proses berjalan sepenuhnya otomatis di latar belakang tanpa memengaruhi data pesanan lainnya.

## Task

### 1. Bangun halaman detail pesanan dengan status Selesai

### 2. Buat komponen indikator penghapusan foto otomatis

### 3. Buat tampilan notifikasi status penghapusan gagal

### 4. Integrasi tampilkan status hapus di halaman detail

### 5. Buat tabel log penghapusan foto di Supabase

### 6. Buat fungsi terjadwal cek pesanan Selesai lebih 2x24 jam

### 7. Buat service penghapusan foto dari Cloudinary

### 8. Buat mekanisme retry gagal hapus dengan log error

### 9. Buat endpoint cek status penghapusan per pesanan
