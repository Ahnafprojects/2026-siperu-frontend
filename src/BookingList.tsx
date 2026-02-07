import { useEffect, useState } from "react";

interface Booking {
  id: number;
  studentName: string;
  purpose: string;
  room: { name: string };
  startTime: string;
  endTime: string;
  status: string;
}

export default function BookingList({ refreshTrigger }: { refreshTrigger: number }) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [search, setSearch] = useState("");
  const [processing, setProcessing] = useState<number | null>(null); // Loading state per tombol

  const API_URL = "http://localhost:5250/api/bookings";

  useEffect(() => {
    fetchBookings();
  }, [refreshTrigger, search]);

  const fetchBookings = async () => {
    let url = API_URL;
    if (search) url += `?search=${search}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      setBookings(data);
    } catch (error) {
      console.error("Gagal ambil data:", error);
    }
  };

  // --- FITUR BARU: UBAH STATUS (Sesuai Soal Poin 2) ---
  const handleStatusUpdate = async (id: number, newStatus: string) => {
    if (!confirm(`Yakin ingin mengubah status menjadi ${newStatus}?`)) return;

    setProcessing(id); // Nyalakan loading di tombol yg diklik

    try {
      const response = await fetch(`${API_URL}/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newStatus), // Kirim string "Approved" atau "Rejected"
      });

      if (response.ok) {
        // Refresh tabel otomatis setelah sukses update
        fetchBookings(); 
      } else {
        alert("Gagal update status");
      }
    } catch (error) {
      console.error(error);
      alert("Error koneksi");
    } finally {
      setProcessing(null);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 mt-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">📅 Manajemen Peminjaman</h2>
        
        {/* Fitur Search (Poin 3) */}
        <input 
          type="text" 
          placeholder="Cari nama..." 
          className="border p-2 rounded-lg text-sm w-64"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mahasiswa</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ruangan</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Waktu</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aksi</th> {/* Kolom Baru */}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {bookings.map((b) => (
              <tr key={b.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{b.studentName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{b.room?.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(b.startTime).toLocaleDateString()}
                </td>
                
                {/* Badge Status */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${b.status === 'Approved' ? 'bg-green-100 text-green-800' : 
                      b.status === 'Rejected' ? 'bg-red-100 text-red-800' : 
                      'bg-yellow-100 text-yellow-800'}`}>
                    {b.status}
                  </span>
                </td>

                {/* TOMBOL AKSI (Hanya muncul jika status masih Pending) */}
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {b.status === "Pending" ? (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleStatusUpdate(b.id, "Approved")}
                        disabled={processing === b.id}
                        className="text-white bg-green-500 hover:bg-green-600 px-3 py-1 rounded-md text-xs transition"
                      >
                        {processing === b.id ? "..." : "✓ Terima"}
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(b.id, "Rejected")}
                        disabled={processing === b.id}
                        className="text-white bg-red-500 hover:bg-red-600 px-3 py-1 rounded-md text-xs transition"
                      >
                        {processing === b.id ? "..." : "✕ Tolak"}
                      </button>
                    </div>
                  ) : (
                    <span className="text-gray-400 text-xs italic">Selesai</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}