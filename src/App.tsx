import { useEffect, useState } from "react";
import type { Room } from "./types";
import BookingForm from "./BookingForm.tsx"; // <--- Import component tadi

function App() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  // Pastikan port backend benar
  const API_URL = "http://localhost:5250/api/rooms";

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setRooms(data);
    } catch (error) {
      console.error("Error fetching rooms:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          🏛️ Sistem Peminjaman Ruangan
        </h1>

        {/* LIST RUANGAN */}
        {loading ? (
          <p className="text-center text-gray-500">Sedang memuat data...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {rooms.map((room) => (
              <div key={room.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-xl font-bold text-gray-900">{room.name}</h2>
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-semibold">
                    {room.capacity} Orang
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-4">{room.description}</p>
                <div className={`text-sm font-medium ${room.isAvailable ? 'text-green-600' : 'text-red-600'}`}>
                   ● {room.isAvailable ? "Tersedia" : "Tidak Tersedia"}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* FORMULIR (Hanya muncul jika ada data ruangan) */}
        {rooms.length > 0 && (
          <BookingForm 
            rooms={rooms} 
            onSuccess={() => alert("Data berhasil masuk ke Database!")} 
          />
        )}
      </div>
    </div>
  );
}

export default App;