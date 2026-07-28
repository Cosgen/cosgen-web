# Kalender Slot & Libur

Mengelola jumlah slot kerja dan menandai hari libur langsung di kalender.

## Spesifikasi

### Tujuan
Memberikan admin kendali atas kapasitas kerja bulanan dan hari tidak beroperasi agar pelanggan hanya bisa memesan pada hari yang tersedia.
### Selesai bila
- Tampilan kalender menunjukkan status setiap tanggal: slot tersedia, slot habis, atau hari libur.
- Admin dapat mengubah kuota slot bulanan kapan saja, perubahan langsung terlihat di kalender.
- Admin dapat menandai dan membatalkan hari libur pada tanggal tertentu dengan klik langsung.
- Perhitungan slot otomatis memperhitungkan hari libur dan slot yang sudah terpakai oleh order disetujui.
- Tampilan kalender responsif dan mudah digunakan di desktop maupun ponsel.

## Sub-fitur: Atur Kuota Bulanan

Tentukan berapa banyak slot order yang tersedia dalam satu bulan.

### Tujuan
Memungkinkan admin menentukan jumlah maksimal order yang bisa diterima dalam satu bulan agar tidak overload.
### Selesai bila
- Terdapat input angka untuk mengisi “Kuota Slot Bulan Ini” di dekat kalender.
- Saat admin menyimpan, kalender langsung memperbarui indikator slot tersedia pada bulan yang aktif.
- Jika kuota diubah menjadi lebih kecil dari jumlah order yang sudah disetujui, muncul pemberitahuan bahwa order yang sudah masuk tetap berlaku.

## Sub-fitur: Tandai Hari Libur

Klik tanggal di kalender untuk menandainya sebagai hari libur dan tidak menerima order.

### Tujuan
Admin bisa menandai tanggal tertentu sebagai hari libur, sehingga tanggal tersebut tidak dihitung sebagai hari kerja dan tidak bisa menerima order baru.
### Selesai bila
- Admin mengklik tanggal di kalender lalu memilih opsi “Tandai Libur” atau “Jadikan Hari Kerja” (hapus libur).
- Tanggal libur langsung berubah tampilan, misalnya warna abu-abu dengan keterangan “Libur”.
- Slot tersedia otomatis berkurang dari kapasitas bulanan karena hari libur tidak dihitung sebagai hari yang bisa dipesan.

## Sub-fitur: Lihat Slot Tersisa

Melihat sekilas jumlah slot kosong yang masih bisa dipesan pelanggan.

### Tujuan
Memberi admin dan pelanggan informasi ringkas berapa slot yang masih bisa dipesan pada periode aktif, tanpa perlu menghitung manual.
### Selesai bila
- Tampilan ringkasan slot tersisa muncul di dekat kalender, misalnya “Slot tersedia bulan ini: 4 dari 10”.
- Angka diperbarui otomatis setiap kali kuota diubah, hari libur ditandai/dibatalkan, atau order disetujui.
- Di halaman pemesanan pelanggan, slot tersisa ditampilkan dan tombol “Pesan” tidak bisa diklik jika slot habis.

## Task

### 1. Buat halaman kalender admin dengan data tiruan kuota dan slot

### 2. Implementasi tandai dan hapus hari libur pada kalender

### 3. Buat skema database dan migrasi untuk kuota bulanan dan hari libur

### 4. Buat API endpoint CRUD kuota bulanan

### 5. Buat API endpoint tandai dan hapus hari libur

### 6. Buat API endpoint data kalender bulanan dengan status slot

### 7. Buat API endpoint ringkasan slot tersisa bulan ini
