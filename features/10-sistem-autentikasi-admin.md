# Sistem Autentikasi Admin

Admin dapat login dengan aman melalui Supabase Auth yang dilengkapi proteksi brute-force, Row Level Security, dan Middleware Next.js untuk mencegah akses tanpa izin ke dashboard.

## Spesifikasi

### Tujuan
Admin dapat login dengan aman menggunakan email dan password, serta sistem melindungi akun dari percobaan login paksa dan memastikan hanya admin yang sudah login yang bisa mengakses halaman dashboard.

### Selesai bila
- Halaman login menampilkan kolom Email, kolom Password, dan tombol "Masuk".
- Jika percobaan login gagal beberapa kali berturut-turut, akun terkunci sementara dan muncul pemberitahuan.
- Saat seseorang mencoba mengakses alamat dashboard tanpa login, halaman langsung mengarahkan ke halaman login.
- Setelah login berhasil, halaman utama dashboard terbuka.
- Tombol "Keluar" di dashboard mengakhiri sesi, dan setelah logout dashboard tidak bisa dibuka kembali tanpa login ulang.

## Task

### 1. Buat halaman login & komponen form autentikasi

### 2. Buat mekanisme redirect ke login dari dashboard

### 3. Buat layout dasar dashboard admin setelah login

### 4. Buat tampilan notifikasi error brute‑force di login

### 5. Buat tombol dan logika logout di dashboard

### 6. Konfigurasi Supabase Auth email‑password untuk admin

### 7. Buat middleware Next.js cek sesi admin global

### 8. Implementasi rate‑limit dan penguncian brute‑force login

### 9. Setup Row Level Security tabel admin di Supabase

### 10. Buat endpoint API logout supabase sisi server
