# SiPeru Frontend
![CI](https://github.com/Ahnafprojects/2026-siperu-frontend/actions/workflows/ci.yml/badge.svg?branch=develop)

Frontend dashboard untuk manajemen peminjaman ruangan. Aplikasi ini membantu admin memantau status ruangan, mengelola peminjaman, serta melihat jadwal penggunaan.

**Description**
SiPeru Frontend menyediakan antarmuka untuk proses peminjaman ruangan agar lebih terstruktur, cepat, dan mudah dipantau.

**Features**
- Dashboard statistik peminjaman dan ketersediaan ruangan
- Daftar peminjaman dengan filter nama, ruangan, dan tanggal
- Modal untuk tambah, detail, ubah status, dan hapus peminjaman
- Tampilan jadwal penggunaan per ruangan

**Tech Stack**
- React 19 + TypeScript
- Vite 7
- Tailwind CSS 4
- Framer Motion
- Lucide React

**Installation**
1. `npm install`

**Usage**
1. Development: `npm run dev`
2. Build: `npm run build`
3. Preview build: `npm run preview`
4. Lint: `npm run lint`

**Environment Variables**
- Salin contoh konfigurasi: `cp .env.example .env`
- Isi nilai yang diperlukan di `.env`

Variabel yang tersedia:
- `VITE_API_BASE_URL` = base URL backend (contoh: `http://localhost:5250/api`)

**Contributing (Optional)**
- PR dan issue dipersilakan. Jelaskan konteks perubahan dan langkah uji.

**License**
- UNLICENSED (belum ada lisensi resmi)

**Credits / Author Info (Optional)**
- Ahnafprojects
