import { useCallback, useEffect, useState } from "react";
import type { Room } from "./types";
import { Layout } from "./components/Layout";
import { StatsGrid } from "./components/StatsGrid";
import { RoomGrid } from "./components/RoomGrid";
import { BookingTable } from "./components/BookingTable";
import { BookingFormModal } from "./components/BookingFormModal";
import { BookingDetailModal } from "./components/BookingDetailModal";
import { RoomScheduleModal } from "./components/RoomScheduleModal";
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
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Room Schedule Modal State
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);

  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const [processingId, setProcessingId] = useState<number | null>(null);

  // Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [roomFilter, setRoomFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("");

  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5250/api";

  const fetchData = useCallback(async () => {
    try {
      const [roomsRes, bookingsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/rooms`),
        fetch(`${API_BASE_URL}/bookings`),
      ]);

      const roomsData: Room[] = await roomsRes.json();
      const bookingsData: Booking[] = await bookingsRes.json();

      setRooms(roomsData);

      // Sort: Pending first, then by Id descending (newest first)
      const sortedBookings = [...bookingsData].sort((a, b) => {
        if (a.status === 'Pending' && b.status !== 'Pending') return -1;
        if (a.status !== 'Pending' && b.status === 'Pending') return 1;
        return b.id - a.id;
      });
      setBookings(sortedBookings);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, [API_BASE_URL]);

  useEffect(() => {
    fetchData();
  }, [fetchData, refreshTrigger]);

  const isTimeOverlap = (aStart: string, aEnd: string, bStart: string, bEnd: string) => {
    const aStartTime = new Date(aStart).getTime();
    const aEndTime = new Date(aEnd).getTime();
    const bStartTime = new Date(bStart).getTime();
    const bEndTime = new Date(bEnd).getTime();
    return aStartTime < bEndTime && aEndTime > bStartTime;
  };

  const updateBookingStatus = async (id: number, newStatus: string) => {
    return fetch(`${API_BASE_URL}/bookings/${id}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newStatus),
    });
  };

  const handleStatusUpdate = async (id: number, newStatus: string) => {
    setProcessingId(id);
    try {
      const response = await updateBookingStatus(id, newStatus);

      if (response.ok) {
        if (newStatus === "Approved") {
          const approvedBooking = bookings.find(b => b.id === id);
          if (approvedBooking) {
            const conflicts = bookings.filter(b =>
              b.id !== id &&
              b.status === "Pending" &&
              b.room?.name === approvedBooking.room?.name &&
              isTimeOverlap(
                approvedBooking.startTime,
                approvedBooking.endTime,
                b.startTime,
                b.endTime
              )
            );

            if (conflicts.length > 0) {
              await Promise.all(
                conflicts.map(conflict => updateBookingStatus(conflict.id, "Rejected"))
              );
            }
          }
        }

        setRefreshTrigger((prev) => prev + 1);
        if (selectedBooking && selectedBooking.id === id) {
          setSelectedBooking({ ...selectedBooking, status: newStatus });
          if (newStatus === 'Cancelled') setIsDetailOpen(false); // Close if cancelled by user
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
    if (!confirm("Apakah Anda yakin ingin menghapus data ini secara permanen?")) return;

    setProcessingId(id);
    try {
      const response = await fetch(`${API_BASE_URL}/bookings/${id}`, {
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
  const approvedBookingsCount = bookings.filter(b => b.status === "Approved").length;

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
        totalBookings={approvedBookingsCount}
        activeRooms={activeRoomsCount}
      />

      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Rooms Status</h2>
        <RoomGrid
          rooms={rooms}
          bookings={bookings}
          onRoomClick={(room) => {
            setSelectedRoom(room);
            setIsScheduleOpen(true);
          }}
        />
      </div>

      <div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-4 gap-4">
          <h2 className="text-xl font-bold text-gray-800">Data Peminjaman</h2>

          <div className="flex flex-col sm:flex-row flex-wrap gap-3 w-full md:w-auto">
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                placeholder="Cari mahasiswa..."
                className="pl-10 pr-4 py-2 rounded-lg glass-input text-sm w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <svg className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </div>
            <select
              className="px-4 py-2 rounded-lg glass-input text-sm w-full sm:w-56"
              value={roomFilter}
              onChange={(e) => setRoomFilter(e.target.value)}
            >
              <option value="All">Semua Ruangan</option>
              {rooms.map(r => <option key={r.id} value={r.name}>{r.name}</option>)}
            </select>
            <input
              type="date"
              className="px-4 py-2 rounded-lg glass-input text-sm w-full sm:w-44"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            />
            <button
              type="button"
              className="px-4 py-2 rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 w-full sm:w-auto"
              onClick={() => {
                setSearchTerm("");
                setRoomFilter("All");
                setDateFilter("");
              }}
            >
              Reset Filter
            </button>
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

      <RoomScheduleModal
        room={selectedRoom}
        bookings={bookings}
        isOpen={isScheduleOpen}
        onClose={() => setIsScheduleOpen(false)}
      />
    </Layout>
  );
}

export default App;
