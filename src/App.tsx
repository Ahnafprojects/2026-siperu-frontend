import { useEffect, useState } from "react";
import type { Room } from "./types";
import BookingForm from "./BookingForm";
import BookingList from "./BookingList"; // <--- Import Komponen Baru

function App() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  
  // State trigger: Angka yang berubah kalau ada submit sukses -> bikin tabel refresh otomatis
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const API_URL = "http://localhost:5250/api/rooms";

  useEffect(() => {
    fetchRooms();
  }, [refreshTrigger]); // Fetch ulang kalau ada perubahan data

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
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center">
          🏛️ Sistem Peminjaman Ruangan (SIPERU)
        </h1>
        <p className="text-center text-gray-500 mb-8">Pencatatan Terpusat & Monitoring Status</p>

        {/* 1. DAFTAR RUANGAN (Fitur Info) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {rooms.map((room) => (
            <div key={room.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
              <div className="flex justify-between items-start mb-2">
                <h2 className="text-lg font-bold text-gray-900">{room.name}</h2>
                <span className={`text-xs px-2 py-1 rounded-full font-semibold ${room.isAvailable ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                   {room.isAvailable ? "Tersedia" : "Penuh"}
                </span>
              </div>
              <p className="text-gray-500 text-xs">Kapasitas: {room.capacity} Org</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 2. FORMULIR (Fitur No. 1: Pencatatan) */}
          <div className="lg:col-span-1">
             <BookingForm 
               rooms={rooms} 
               onSuccess={() => setRefreshTrigger(prev => prev + 1)} // Refresh tabel setelah submit
             />
          </div>

          {/* 3. TABEL RIWAYAT (Fitur No. 2 & 3: Status & Search) */}
          <div className="lg:col-span-2">
            <BookingList refreshTrigger={refreshTrigger} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;