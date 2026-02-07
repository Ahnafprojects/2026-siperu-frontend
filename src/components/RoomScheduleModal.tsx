import { X, Calendar, User, CheckCircle, XCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { Room } from "../types";

interface Booking {
    id: number;
    studentName: string;
    purpose: string;
    room: { name: string };
    startTime: string;
    endTime: string;
    status: string;
}

interface RoomScheduleModalProps {
    room: Room | null;
    bookings: Booking[];
    isOpen: boolean;
    onClose: () => void;
}

export const RoomScheduleModal = ({ room, bookings, isOpen, onClose }: RoomScheduleModalProps) => {
    if (!room) return null;

    // Filter relevant bookings and sort by time
    // For simplicity, showing all upcoming bookings. Ideally filter for "Today" or specific range.
    const roomBookings = bookings
        .filter(b => b.room.name === room.name && b.status !== 'Rejected') // Assuming filtering by name or ID if available in Filter
        .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                        onClick={onClose}
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    >
                        <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100 flex flex-col max-h-[80vh]">
                            {/* Header */}
                            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">{room.name}</h2>
                                    <p className={`text-sm font-medium mt-1 flex items-center gap-2 ${room.isAvailable ? 'text-green-600' : 'text-red-500'}`}>
                                        {room.isAvailable ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                                        {room.isAvailable ? 'Tersedia Sekarang' : 'Sedang Digunakan'}
                                    </p>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-2 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Schedule List */}
                            <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
                                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Jadwal Penggunaan</h3>

                                {roomBookings.length === 0 ? (
                                    <div className="text-center py-12 text-gray-400">
                                        <Calendar className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                        <p>Belum ada jadwal untuk ruangan ini.</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {roomBookings.map((booking) => (
                                            <div key={booking.id} className="relative pl-6 pb-2 border-l-2 border-gray-100 last:border-0">
                                                <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 ${booking.status === 'Approved' ? 'border-green-500 bg-green-50' : 'border-yellow-400 bg-yellow-50'
                                                    }`} />

                                                <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <span className="font-bold text-gray-800 text-lg">
                                                            {new Date(booking.startTime).toLocaleTimeString("id-ID", { hour: '2-digit', minute: '2-digit' })}
                                                            <span className="text-gray-400 font-normal mx-2">-</span>
                                                            {new Date(booking.endTime).toLocaleTimeString("id-ID", { hour: '2-digit', minute: '2-digit' })}
                                                        </span>
                                                        <span className={`text-[10px] px-2 py-1 rounded-full border ${booking.status === 'Approved' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-yellow-50 text-yellow-600 border-yellow-100'
                                                            }`}>
                                                            {booking.status}
                                                        </span>
                                                    </div>

                                                    <p className="text-gray-900 font-medium mb-1">{booking.purpose}</p>
                                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                                        <User className="w-3 h-3" />
                                                        {booking.studentName}
                                                        <span className="text-gray-300">|</span>
                                                        <Calendar className="w-3 h-3" />
                                                        {new Date(booking.startTime).toLocaleDateString("id-ID", { day: 'numeric', month: 'short' })}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
