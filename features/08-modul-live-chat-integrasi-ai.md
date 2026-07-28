# Modul Live Chat & Integrasi AI

Menyediakan live chat untuk pelanggan tanpa login dan integrasi AI untuk otomatisasi respons dan sinkronisasi Google Drive.

## Spesifikasi

### Tujuan
Menyediakan saluran komunikasi langsung (Live Chat) bagi pelanggan tanpa login, serta otomatisasi percakapan via bot AI di Instagram untuk menjawab pertanyaan progres dan harga, sekaligus sinkronisasi folder Google Drive untuk akses hasil kerja.
### Selesai bila
- Pelanggan dapat memulai obrolan langsung dengan admin dari halaman Cek Status atau portal tanpa perlu login, dan admin dapat melihat serta membalasnya dari Dashboard.
- Bot AI (via n8n/UChat) di Instagram secara otomatis membalas DM yang menanyakan progres dengan meminta kode order lalu memberikan tautan Cek Status yang sesuai.
- Bot AI memberikan tautan langsung ke bagian Pricelist di Landing Page ketika pengguna Instagram menanyakan harga.
- Setiap kali pesanan dibuat, sistem otomatis membuat folder Google Drive khusus (Review dan Final) dengan hak akses ‘Anyone with the link’, dan link-nya tertampil di Dashboard Admin serta halaman Cek Status pelanggan.

## Sub-fitur: n8n AI Chatbot (IG/UChat)

Konfigurasi bot otomatis untuk menjawab pertanyaan umum di Instagram, seperti progres dengan kode order dan URL pricelist.

### Tujuan
Mengotomatiskan jawaban atas pertanyaan umum di Instagram agar pelanggan mendapat informasi instan tanpa menunggu admin.
### Selesai bila
- Bot mengenali pesan yang menanyakan progres (misal ‘cek status’, ‘progress’, ‘order’) dan membalas dengan meminta kode order lalu memberikan URL Cek Status yang bisa diklik.
- Bot mengenali pesan yang menanyakan harga atau paket (misal ‘pricelist’, ‘harga’, ‘biaya’) dan membalas dengan tautan langsung ke bagian Pricelist di Landing Page.
- Admin dapat melihat ringkasan percakapan bot (log) dari Dashboard untuk memantau interaksi yang terjadi.

## Sub-fitur: Google Drive API / n8n

Sinkronisasi folder otomatis per pesanan dengan akses Anyone with the link.

### Tujuan
Memastikan setiap pesanan memiliki folder Google Drive yang siap pakai secara otomatis sehingga admin tinggal mengunggah hasil kerja dan pelanggan bisa langsung mengaksesnya.
### Selesai bila
- Begitu pesanan disetujui (status ORD), sistem langsung membuat folder Review dan folder Final di Google Drive dengan setelan akses ‘Anyone with the link’.
- Link folder Review muncul di Dashboard Admin dan otomatis ditampilkan ke pelanggan saat status berubah menjadi ‘Review’.
- Link folder Final muncul di Dashboard Admin dan otomatis ditampilkan ke pelanggan setelah status ‘Selesai’.
- Kedua link tersebut dapat disalin oleh admin atau diklik langsung oleh pelanggan dari halaman Cek Status tanpa perlu login ke Google.

## Task

### 1. Buat halaman live chat di Cek Status

### 2. Bangun komponen daftar percakapan di dashboard

### 3. Bangun komponen jendela chat admin

### 4. Buat tampilan detail folder Google Drive di dashboard

### 5. Buat indikator status bot Instagram di dashboard

### 6. Buat skema tabel percakapan di Supabase

### 7. Buat API endpoint kirim dan terima pesan

### 8. Buat API endpoint daftar percakapan admin

### 9. Buat webhook pemicu pembuatan folder Google Drive

### 10. Konfigurasi alur n8n chatbot Instagram

### 11. Hubungkan alur n8n ke Google Drive untuk pembuatan folder

### 12. Buat skema kolom link folder di tabel pesanan

### 13. Buat API endpoint untuk cek kode order di n8n
