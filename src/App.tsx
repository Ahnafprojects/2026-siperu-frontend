import { useEffect, useState } from "react";
import type { Room } from "./types"; // Import tipe data tadi

function App() {
  // State untuk menyimpan data ruangan
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  // URL Backend (SESUAIKAN PORT-NYA!)
  const API_URL = "http://localhost:5250/api/rooms";

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error("Gagal mengambil data");
      }
      const data = await response.json();
      setRooms(data); // Simpan data ke state
    } catch (error) {
      console.error("Error fetching rooms:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          🏛️ Daftar Ruangan Kampus
        </h1>

        {loading ? (
          <p className="text-gray-500">Sedang memuat data...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {rooms.map((room) => (
              <div
                key={room.id}
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition border border-gray-100"
              >
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-semibold text-blue-600">
                    {room.name}
                  </h2>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      room.isAvailable
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {room.isAvailable ? "Tersedia" : "Dipakai"}
                  </span>
                </div>
                
                <p className="text-gray-600 text-sm mb-4">
                  {room.description || "Tidak ada deskripsi"}
                </p>

                <div className="flex items-center text-gray-500 text-sm">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Kapasitas: {room.capacity} Orang
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;