import { useEffect, useState } from "react";
import type { Room } from "./types";
import { Layout } from "./components/Layout";
import { StatsGrid } from "./components/StatsGrid";
import { RoomGrid } from "./components/RoomGrid";
import { BookingTable } from "./components/BookingTable";
import { BookingFormModal } from "./components/BookingFormModal";
import { BookingDetailModal } from "./components/BookingDetailModal";
import { Plus } from "lucide-react";

interface Booking {
  id: number;
  studentName: string;
  purpose: string;
  room: { name: string };
  startTime: string;
  endTime: string;
  status: string;
}

function App() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  // Detail Modal State
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const [processingId, setProcessingId] = useState<number | null>(null);

  // Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [roomFilter, setRoomFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("");

  const API_URL = "http://localhost:5250/api";

  useEffect(() => {
    fetchData();
  }, [refreshTrigger]);

  const fetchData = async () => {
    try {
      const [roomsRes, bookingsRes] = await Promise.all([
        fetch(`${API_URL}/rooms`),
        fetch(`${API_URL}/bookings`),
      ]);

      const roomsData = await roomsRes.json();
      const bookingsData = await bookingsRes.json();

      setRooms(roomsData);

      // Sort: Pending first, then by Id descending (newest first)
      const sortedBookings = bookingsData.sort((a: any, b: any) => {
        if (a.status === 'Pending' && b.status !== 'Pending') return -1;
        if (a.status !== 'Pending' && b.status === 'Pending') return 1;
        return b.id - a.id;
      });
      setBookings(sortedBookings);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleStatusUpdate = async (id: number, newStatus: string) => {
    setProcessingId(id);
    try {
      const response = await fetch(`${API_URL}/bookings/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newStatus),
      });

      if (response.ok) {
        setRefreshTrigger((prev) => prev + 1);
        if (selectedBooking && selectedBooking.id === id) {
          setSelectedBooking({ ...selectedBooking, status: newStatus });
        }
      } else {
        alert("Failed to update status");
      }
    } catch (error) {
      console.error(error);
      alert("Connection error");
    } finally {
      setProcessingId(null);
    }
  };

  const handleDeleteBooking = async (id: number) => {
    if (!confirm("Are you sure you want to delete this booking?")) return;

    setProcessingId(id);
    try {
      const response = await fetch(`${API_URL}/bookings/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setRefreshTrigger(prev => prev + 1);
        setIsDetailOpen(false);
      } else {
        alert("Failed to delete booking");
      }
    } catch (error) {
      console.error(error);
      alert("Connection error");
    } finally {
      setProcessingId(null);
    }
  };

  const activeRoomsCount = rooms.filter(r => r.isAvailable).length;

  return (
    <Layout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard</h1>
          <p className="text-gray-500">Welcome back, Admin</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-green-600 hover:bg-green-500 text-white rounded-xl font-medium transition-colors shadow-lg shadow-green-500/25"
        >
          <Plus className="w-5 h-5" />
          New Booking
        </button>
      </div>

      <StatsGrid
        totalBookings={bookings.length}
        activeRooms={activeRoomsCount}
      />

      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Rooms Status</h2>
        <RoomGrid rooms={rooms} />
      </div>

      <div>
        <div className="flex flex-col md:flex-row justify-between items-end mb-4 gap-4">
          <h2 className="text-xl font-bold text-gray-800">Data Peminjaman</h2>

          <div className="flex gap-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Cari mahasiswa..."
                className="pl-10 pr-4 py-2 rounded-lg glass-input text-sm w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <svg className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </div>
            <select
              className="px-4 py-2 rounded-lg glass-input text-sm"
              value={roomFilter}
              onChange={(e) => setRoomFilter(e.target.value)}
            >
              <option value="All">Semua Ruangan</option>
              {rooms.map(r => <option key={r.id} value={r.name}>{r.name}</option>)}
            </select>
            <input
              type="date"
              className="px-4 py-2 rounded-lg glass-input text-sm"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            />
          </div>
        </div>

        <BookingTable
          bookings={bookings.filter(b => {
            const matchesSearch = b.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
              b.purpose.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesRoom = roomFilter === "All" || b.room.name === roomFilter;
            const matchesDate = !dateFilter || b.startTime.startsWith(dateFilter);
            return matchesSearch && matchesRoom && matchesDate;
          })}
          onStatusUpdate={handleStatusUpdate}
          onView={(booking) => {
            setSelectedBooking(booking);
            setIsDetailOpen(true);
          }}
          processing={processingId}
        />
      </div>

      <BookingFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        rooms={rooms}
        onSuccess={() => setRefreshTrigger(prev => prev + 1)}
      />

      <BookingDetailModal
        booking={selectedBooking}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        onStatusUpdate={handleStatusUpdate}
        onDelete={handleDeleteBooking}
        processing={processingId === selectedBooking?.id}
      />
    </Layout>
  );
}

export default App;