import { useState } from "react";
import type { Room } from "./types";

interface BookingFormProps {
  rooms: Room[];
  onSuccess: () => void; // Callback biar list refresh kalau sukses
}

export default function BookingForm({ rooms, onSuccess }: BookingFormProps) {
  // State untuk form
  const [formData, setFormData] = useState({
    studentName: "",
    purpose: "",
    roomId: rooms.length > 0 ? rooms[0].id : 0, // Default pilih ruangan pertama
    startTime: "",
    endTime: "",
  });

  const [loading, setLoading] = useState(false);

  // URL Backend (SESUAIKAN PORT!)
  const API_URL = "http://localhost:5250/api/bookings";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          roomId: Number(formData.roomId), // Pastikan jadi number
        }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        alert("Gagal meminjam: " + errorData);
        return;
      }

      alert("🎉 Peminjaman Berhasil diajukan!");
      // Reset form
      setFormData({ ...formData, studentName: "", purpose: "" });
      onSuccess(); // Panggil fungsi refresh dari induk
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan koneksi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 mt-8">
      <h2 className="text-xl font-bold text-gray-800 mb-4">📝 Form Peminjaman</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Nama Mahasiswa */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Nama Mahasiswa</label>
          <input
            type="text"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
            value={formData.studentName}
            onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
          />
        </div>

        {/* Keperluan */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Keperluan</label>
          <textarea
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
            value={formData.purpose}
            onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
          />
        </div>

        {/* Pilih Ruangan */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Pilih Ruangan</label>
          <select
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
            value={formData.roomId}
            onChange={(e) => setFormData({ ...formData, roomId: Number(e.target.value) })}
          >
            {rooms.map((room) => (
              <option key={room.id} value={room.id}>
                {room.name} (Kapasitas: {room.capacity})
              </option>
            ))}
          </select>
        </div>

        {/* Tanggal Mulai & Selesai */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Mulai</label>
            <input
              type="datetime-local"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
              value={formData.startTime}
              onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Selesai</label>
            <input
              type="datetime-local"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
              value={formData.endTime}
              onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400"
        >
          {loading ? "Memproses..." : "Ajukan Peminjaman"}
        </button>
      </form>
    </div>
  );
}