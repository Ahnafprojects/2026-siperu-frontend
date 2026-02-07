import { Check, X, Eye } from "lucide-react";
import { useState } from "react";
import { Edit2, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { GlassCard } from "./GlassCard";

interface Booking {
    id: number;
    studentName: string;
    purpose: string;
    room: { name: string };
    startTime: string;
    endTime: string;
    status: string;
}

interface BookingTableProps {
    bookings: Booking[];
    onStatusUpdate: (id: number, status: string) => void;
    onView: (booking: Booking) => void;
    processing: number | null;
}

export const BookingTable = ({ bookings, onStatusUpdate, onView, processing }: BookingTableProps) => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // Calculate pagination pages
    const totalPages = Math.ceil(bookings.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentBookings = bookings.slice(startIndex, startIndex + itemsPerPage);

    const handlePrevPage = () => {
        if (currentPage > 1) setCurrentPage(prev => prev - 1);
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
    };

    if (bookings.length === 0) {
        return (
            <div className="text-center py-12 bg-white/50 backdrop-blur-xl rounded-2xl border border-white/20 shadow-xl">
                <p className="text-gray-500">Belum ada data peminjaman.</p>
            </div>
        );
    }

    return (
        <div className="bg-white/50 backdrop-blur-xl rounded-2xl border border-white/20 shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="bg-gray-50/50 border-b border-gray-100">
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Mahasiswa</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Ruangan</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Waktu</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {currentBookings.map((booking) => (
                            <tr key={booking.id} className="hover:bg-white/50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium text-gray-900">{booking.studentName}</span>
                                        <span className="text-xs text-gray-500">{booking.purpose}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="px-2 py-1 text-xs font-medium bg-blue-50 text-blue-700 rounded-lg">
                                        {booking.room.name}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex flex-col text-sm text-gray-500">
                                        <span>{new Date(booking.startTime).toLocaleDateString()}</span>
                                        <span className="text-xs">
                                            {new Date(booking.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -
                                            {new Date(booking.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 py-1 text-xs font-medium rounded-full border ${booking.status === 'Approved' ? 'bg-green-100 text-green-700 border-green-200' :
                                        booking.status === 'Rejected' ? 'bg-red-100 text-red-700 border-red-200' :
                                            'bg-yellow-100 text-yellow-700 border-yellow-200'
                                        }`}>
                                        {booking.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <div className="flex items-center justify-end gap-2">
                                        <button
                                            onClick={() => onView(booking)}
                                            className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                            title="Lihat Detail"
                                        >
                                            <Eye className="w-4 h-4" />
                                        </button>
                                        {booking.status === 'Pending' && (
                                            <>
                                                <button
                                                    onClick={() => onStatusUpdate(booking.id, 'Approved')}
                                                    disabled={processing === booking.id}
                                                    className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs rounded-lg transition-colors disabled:opacity-50"
                                                >
                                                    {processing === booking.id ? '...' : 'Approve'}
                                                </button>
                                                <button
                                                    onClick={() => onStatusUpdate(booking.id, 'Rejected')}
                                                    disabled={processing === booking.id}
                                                    className="px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-600 text-xs rounded-lg transition-colors disabled:opacity-50"
                                                >
                                                    Reject
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/30">
                    <p className="text-sm text-gray-500">
                        Menampilkan <span className="font-medium">{startIndex + 1}</span> sampai <span className="font-medium">{Math.min(startIndex + itemsPerPage, bookings.length)}</span> dari <span className="font-medium">{bookings.length}</span> data
                    </p>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handlePrevPage}
                            disabled={currentPage === 1}
                            className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronLeft className="w-5 h-5 text-gray-600" />
                        </button>
                        <span className="text-sm font-medium text-gray-700">
                            Halaman {currentPage}
                        </span>
                        <button
                            onClick={handleNextPage}
                            disabled={currentPage === totalPages}
                            className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronRight className="w-5 h-5 text-gray-600" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
