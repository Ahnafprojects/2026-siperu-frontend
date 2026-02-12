# Changelog

All notable changes to this project will be documented in this file.

## v1.0.0 - 2026-02-07

### Added
- Dashboard admin untuk peminjaman ruangan.
- Ringkasan statistik, status ruangan, dan tabel peminjaman.
- Modal pembuatan peminjaman, detail peminjaman, dan jadwal ruangan.
- Filter pencarian berdasarkan nama mahasiswa, ruangan, dan tanggal.
- Konfigurasi lingkungan publik melalui `VITE_API_BASE_URL`.

## [v1.0.1] - 2026-02-10
### Fixed
- Display trimmed daily booking summary in room modal to improve readability.

## [v1.0.2] - 2026-02-12
### Added
- Auto-reject pending bookings that overlap when an approved booking is confirmed.
- Reset filter button for search, room, and date filters.

### Changed
- Booking stats now show total approved bookings.
