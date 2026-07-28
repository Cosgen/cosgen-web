# Portal Cek Status Order (Customer)

Fitur bagi pelanggan untuk memeriksa progres pesanan berdasarkan kode order (REQ/ORD).

## Spesifikasi

### Tujuan
Memberikan akses bagi pelanggan untuk memantau detail dan perkembangan pesanannya menggunakan kode order (REQ/ORD) yang dimiliki.

### Selesai bila
- Pelanggan dapat memasukkan kode order di halaman Cek Status dan melihat informasi lengkap pesanan (detail pesanan, status terbaru, rincian biaya, opsi pembayaran, dan riwayat progres).
- Informasi yang tampil selalu mutakhir sesuai perubahan status yang dilakukan admin di dashboard.
- Halaman menampilkan komponen Ringkasan Nota & Pembayaran, status Pembayaran Terkunci (jika berlaku), serta area komunikasi untuk siklus revisi.
- Tersedia akses mudah untuk menghubungi admin via chat/link eksternal (jika diaktifkan).

## Sub-fitur: Ringkasan Nota & Pembayaran

Menampilkan rincian biaya dan tombol Bayar Sekarang via Midtrans Snap yang aktif setelah status Menunggu Pembayaran.

### Tujuan
Menampilkan rincian biaya pesanan dan memungkinkan pelanggan melakukan pembayaran melalui Midtrans Snap hanya setelah pesanan memasuki status “Menunggu Pembayaran”.

### Selesai bila
- Rincian biaya (jenis paket, jumlah foto, add-on, total) muncul di halaman Cek Status dengan format harga yang jelas (misal RpXXX.XXX).
- Tombol “Bayar Sekarang” terlihat hanya ketika status pesanan adalah “Menunggu Pembayaran”, dan dalam kondisi aktif (dapat diklik).
- Klik tombol “Bayar Sekarang” membuka popup pembayaran Midtrans Snap; setelah pembayaran sukses, status pesanan berubah menjadi “Selesai” dan tombol pembayaran hilang/diganti dengan konfirmasi sukses.

## Sub-fitur: Pembayaran Terkunci

Tombol Bayar disabled jika status masih Review dan Admin belum mengonfirmasi ACC.

### Tujuan
Mencegah pelanggan membayar sebelum admin memberikan konfirmasi ACC atas hasil review, dengan mengunci tombol bayar hingga status berubah menjadi “Menunggu Pembayaran”.

### Selesai bila
- Pada status “Review” (sebelum admin menekan tombol “Konfirmasi Pelanggan ACC” di dashboard), tombol “Bayar Sekarang” ditampilkan dalam kondisi disabled/tidak bisa diklik.
- Begitu admin mengonfirmasi ACC dan status otomatis berubah menjadi “Menunggu Pembayaran”, tombol “Bayar Sekarang” langsung aktif tanpa perlu refresh halaman.
- Pelanggan tidak bisa memaksa melakukan pembayaran sebelum ACC diberikan (tidak ada celah akses URL/popup pembayaran sebelum status sesuai).

## Sub-fitur: Siklus Revisi

Pelanggan dapat meminta revisi melalui Chat, dan Admin mengubah status kembali ke Sedang Dikerjakan.

### Tujuan
Memberi jalur bagi pelanggan untuk mengajukan permintaan revisi, dan memungkinkan admin mengembalikan status pesanan ke “Sedang Dikerjakan” untuk diproses ulang.

### Selesai bila
- Di halaman Cek Status, terdapat tombol/area “Chat Admin” atau “Minta Revisi” yang memungkinkan pelanggan menyampaikan pesan permintaan revisi.
- Permintaan revisi tercatat di sistem (misal muncul di Live Chat atau notifikasi admin) sehingga admin mengetahui adanya permintaan.
- Admin dapat mengubah status pesanan dari “Review” kembali menjadi “Sedang Dikerjakan” melalui dashboard; perubahan tersebut langsung tercermin di halaman Cek Status pelanggan.

## Task

### 1. Buat halaman Cek Status dengan form input kode order dan layout dasar

### 2. Tampilkan rincian biaya pesanan dari data tiruan

### 3. Implementasi tombol Bayar Sekarang interaktif dengan modal Midtrans Snap tiruan

### 4. Implementasi status Review dengan tombol Bayar disabled dan teks informatif

### 5. Implementasi tombol Ajukan Revisi dan integrasi mock chat di halaman status

### 6. Buat skema dan migrasi database untuk order, item, pembayaran, dan chat

### 7. Buat API endpoint GET /api/order/status/:code

### 8. Buat API endpoint untuk membuat transaksi pembayaran Midtrans Snap

### 9. Buat API endpoint untuk mengirim dan menerima pesan chat order

### 10. Buat API endpoint untuk admin mengubah status pesanan (ACC, revisi)
