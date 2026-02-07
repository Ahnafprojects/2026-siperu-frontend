
import { Users, Wifi, Projector, Clock } from "lucide-react";
import { GlassCard } from "./GlassCard";
import type { Room } from "../types";

interface Booking {
    id: number;
    room: { name: string };
    startTime: string;
    endTime: string;
    status: string;
}

interface RoomGridProps {
    rooms: Room[];
    bookings: Booking[];
    onRoomClick: (room: Room) => void;
}

export const RoomGrid = ({ rooms, bookings, onRoomClick }: RoomGridProps) => {
    const getRoomStatusInfo = (roomName: string, isAvailable: boolean) => {
        const now = new Date();
        const todayBookings = bookings
            .filter(b => b.room.name === roomName && b.status === "Approved")
            .map(b => ({
                start: new Date(b.startTime),
                end: new Date(b.endTime)
            }))
            .filter(b => b.end > now && b.start.getDate() === now.getDate())
            .sort((a, b) => a.start.getTime() - b.start.getTime());

        if (isAvailable) {
            // Room is free properly, check when is the next booking
            const nextBooking = todayBookings.find(b => b.start > now);
            if (nextBooking) {
                const timeStr = nextBooking.start.toLocaleTimeString("id-ID", { hour: '2-digit', minute: '2-digit' });
                return `Kosong sampai ${timeStr}`;
            } else {
                return "Kosong seharian";
            }
        } else {
            // Room is busy, check when it ends
            // Assuming the room is busy because of a booking that covers 'now'
            const currentBooking = todayBookings.find(b => b.start <= now && b.end > now);
            if (currentBooking) {
                const timeStr = currentBooking.end.toLocaleTimeString("id-ID", { hour: '2-digit', minute: '2-digit' });
                return `Dipakai sampai ${timeStr}`;
            } else {
                return "Sedang digunakan"; // Fallback if manually set to busy or inconsistency
            }
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 mb-12">
            {rooms.map((room) => {
                const statusInfo = getRoomStatusInfo(room.name, room.isAvailable);

                return (
                    <GlassCard
                        key={room.id}
                        className="group hover:border-green-500/30 transition-all cursor-pointer hover:shadow-lg hover:shadow-green-500/10 hover:-translate-y-1"
                        gradient
                        onClick={() => onRoomClick(room)}
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-lg font-bold text-gray-800 group-hover:text-green-600 transition-colors">
                                    {room.name}
                                </h3>
                                <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                                    <Users className="w-3 h-3" /> {room.capacity} Orang
                                </p>
                            </div>
                            <span
                                className={`text-xs px-2 py-1 rounded-full font-medium border ${room.isAvailable
                                    ? "bg-green-100 text-green-700 border-green-200"
                                    : "bg-red-100 text-red-700 border-red-200"
                                    }`}
                            >
                                {room.isAvailable ? "Available" : "In Use"}
                            </span>
                        </div>

                        <div className="flex gap-2 mt-4 items-center justify-between">
                            <div className="flex gap-2">
                                <div className="p-2 rounded-lg bg-gray-100" title="WiFi Available">
                                    <Wifi className="w-4 h-4 text-gray-500" />
                                </div>
                                <div className="p-2 rounded-lg bg-gray-100" title="Projector Available">
                                    <Projector className="w-4 h-4 text-gray-500" />
                                </div>
                            </div>
                            <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500 bg-gray-50 px-2 py-1 rounded-md">
                                <Clock className="w-3 h-3" />
                                {statusInfo}
                            </div>
                        </div>
                    </GlassCard>
                );
            })}
        </div>
    );
};
