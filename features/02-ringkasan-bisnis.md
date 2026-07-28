# Ringkasan Bisnis

Melihat grafik ringkasan dan mengunduh laporan total pendapatan serta komisi.

## Spesifikasi

### Tujuan
Admin dapat memantau metrik utama bisnis melalui grafik visual, mengunduh laporan bulanan, dan memastikan data komisi dikelola otomatis.

### Selesai bila
- Grafik perkembangan order mingguan/harian terlihat jelas di halaman Ringkasan Bisnis.
- Tombol unduh menghasilkan laporan yang mencakup total pendapatan, total komisi, dan sisa slot bulanan.
- Seluruh data komisi bulan sebelumnya terhapus otomatis pada hari ke-3 bulan baru tanpa intervensi admin.

## Sub-fitur: Grafik & Time Stamp

Melihat grafik perkembangan order dan waktu terbaru secara visual.

### Tujuan
Menampilkan grafik jumlah order harian dalam satu bulan beserta keterangan waktu data terakhir diperbarui, sehingga admin dapat memonitor tren order secara real-time.

### Selesai bila
- Grafik (berbentuk batang atau garis) menunjukkan jumlah order setiap hari sejak awal bulan hingga hari ini.
- Terdapat label "Terakhir diperbarui" yang menyebut tanggal dan jam data terbaru; label ikut berubah setiap kali ada order baru atau halaman dibuka ulang.
- Grafik langsung terlihat tanpa perlu aksi tambahan begitu halaman Ringkasan diakses admin.

## Sub-fitur: Unduh Rekap Bulanan

Tombol untuk mengunduh laporan pendapatan, komisi, dan sisa slot.

### Tujuan
Admin dapat mengunduh sebuah file ringkasan keuangan bulanan yang berisi pendapatan, komisi, dan sisa slot.

### Selesai bila
- Tombol "Unduh Rekap" (atau ikon unduh) tersedia di halaman Ringkasan Bisnis.
- Setelah diklik, peramban langsung mengunduh file laporan (mis. PDF) yang mencantumkan bulan yang dipilih, total pendapatan, total komisi, dan jumlah slot tersisa.
- Isi file sesuai dengan data di sistem dan dapat dibuka menggunakan aplikasi umum.

## Sub-fitur: Hapus Data Komisi Otomatis

Data seluruh komisi dihapus otomatis 3 hari setelah pergantian bulan.

### Tujuan
Menghapus data komisi bulan sebelumnya secara otomatis tiga hari setelah pergantian bulan, menjaga data ringkasan tetap bersih tanpa perlu tindakan manual.

### Selesai bila
- Pada tanggal 3 bulan baru, semua catatan komisi dengan cap waktu bulan lalu hilang dari penyimpanan.
- Data komisi bulan sebelumnya tidak muncul lagi di halaman Ringkasan Bisnis atau basis data.
- Penghapusan terjadi secara otomatis dan tidak memerlukan konfirmasi atau pemberitahuan khusus kepada admin.

## Task

### 1. Buat halaman Ringkasan Bisnis dengan data komisi bulan berjalan tiruan

### 2. Buat halaman Ringkasan Bisnis dengan grafik order harian menggunakan data tiruan

### 3. Tambahkan migrasi tabel komisi dengan kolom periode di Supabase

### 4. Tambahkan label 'Terakhir diperbarui' dengan timestamp dinamis

### 5. Implementasi tombol 'Unduh Rekap' dan buat file laporan tiruan

### 6. Implementasi cron job hapus data komisi bulan sebelumnya

### 7. Buat endpoint API pemicu manual penghapusan untuk testing

### 8. Buat endpoint API untuk menyediakan data grafik order harian

### 9. Siapkan penjadwalan cron di container Docker

### 10. Buat endpoint API untuk mengunduh rekap bulanan dengan total pendapatan, komisi, dan sisa slot

### 11. Buat migrasi tabel komisi untuk mendukung penghapusan otomatis

### 12. Implementasi cron job penghapusan data komisi pada hari ke-3 bulan baru
