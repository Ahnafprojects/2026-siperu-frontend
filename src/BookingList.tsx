import { useEffect, useState } from "react";

// Definisikan tipe data Booking sesuai Backend
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
  const [search, setSearch] = useState(""); // State untuk filter pencarian

  const API_URL = "http://localhost:5250/api/bookings";

  // Ambil data setiap kali ada perubahan trigger (misal habis submit form)
  useEffect(() => {
    fetchBookings();
  }, [refreshTrigger, search]); // Kalau search berubah, fetch ulang (Live Search)

  const fetchBookings = async () => {
    // Fitur No. 3: Penelusuran Peminjaman (Filter Query)
    let url = API_URL;
    if (search) {
      url += `?search=${search}`;
    }

    try {
      const response = await fetch(url);
      const data = await response.json();
      setBookings(data);
    } catch (error) {
      console.error("Gagal ambil data booking:", error);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 mt-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">📅 Riwayat & Status Peminjaman</h2>
        
        {/* INPUT PENCARIAN (Fitur No. 3) */}
        <input 
          type="text" 
          placeholder="Cari nama / keperluan..." 
          className="border p-2 rounded-lg text-sm w-64"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mahasiswa</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ruangan</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Waktu</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Keperluan</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {bookings.length === 0 ? (
              <tr><td colSpan={5} className="text-center py-4 text-gray-500">Belum ada data peminjaman.</td></tr>
            ) : (
              bookings.map((b) => (
                <tr key={b.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{b.studentName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{b.room?.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(b.startTime).toLocaleDateString()} <br/>
                    <span className="text-xs text-gray-400">
                      {new Date(b.startTime).toLocaleTimeString()} - {new Date(b.endTime).toLocaleTimeString()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{b.purpose}</td>
                  
                  {/* Fitur No. 2: Pengelolaan Status (Badge Warna) */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${b.status === 'Approved' ? 'bg-green-100 text-green-800' : 
                        b.status === 'Rejected' ? 'bg-red-100 text-red-800' : 
                        'bg-yellow-100 text-yellow-800'}`}>
                      {b.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}