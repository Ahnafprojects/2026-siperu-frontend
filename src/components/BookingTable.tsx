import { Check, X, Eye } from "lucide-react";
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
    return (
        <GlassCard className="overflow-hidden p-0">
            <div className="p-6 border-b border-gray-100">
                <h3 className="text-lg font-bold text-gray-800">Recent Bookings</h3>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-500">
                    <thead className="text-xs uppercase bg-gray-50 text-gray-500 hidden md:table-header-group">
                        <tr>
                            <th className="px-6 py-4">Mahasiswa</th>
                            <th className="px-6 py-4">Ruangan</th>
                            <th className="px-6 py-4">Waktu</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {bookings.map((booking) => (
                            <tr key={booking.id} className="hover:bg-gray-50 transition-colors block md:table-row">
                                <td className="px-6 py-2 md:py-4 font-medium text-gray-900 block md:table-cell">
                                    <span className="text-xs uppercase text-gray-400 md:hidden">Mahasiswa</span>
                                    <div>{booking.studentName}</div>
                                </td>
                                <td className="px-6 py-2 md:py-4 block md:table-cell">
                                    <span className="text-xs uppercase text-gray-400 md:hidden">Ruangan</span>
                                    <div>{booking.room?.name}</div>
                                </td>
                                <td className="px-6 py-2 md:py-4 block md:table-cell">
                                    <span className="text-xs uppercase text-gray-400 md:hidden">Waktu</span>
                                    <div>{new Date(booking.startTime).toLocaleDateString()}</div>
                                </td>
                                <td className="px-6 py-2 md:py-4 block md:table-cell">
                                    <span className="text-xs uppercase text-gray-400 md:hidden">Status</span>
                                    <span
                                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${booking.status === "Approved"
                                            ? "bg-green-100 text-green-700 border-green-200"
                                            : booking.status === "Rejected"
                                                ? "bg-red-100 text-red-700 border-red-200"
                                                : "bg-yellow-100 text-yellow-700 border-yellow-200"
                                            }`}
                                    >
                                        {booking.status}
                                    </span>
                                </td>
                                <td className="px-6 py-2 md:py-4 text-left md:text-right block md:table-cell">
                                    <span className="text-xs uppercase text-gray-400 md:hidden">Actions</span>
                                    <div className="flex items-center justify-start md:justify-end gap-2 mt-1 md:mt-0">
                                        <button
                                            onClick={() => onView(booking)}
                                            className="p-1 rounded-md hover:bg-blue-100 text-blue-600 transition-colors"
                                            title="View Details"
                                        >
                                            <Eye className="w-4 h-4" />
                                        </button>
                                        {booking.status === "Pending" && (
                                            <>
                                                <button
                                                    onClick={() => onStatusUpdate(booking.id, "Approved")}
                                                    disabled={processing === booking.id}
                                                    className="p-1 rounded-md hover:bg-green-100 text-green-600 transition-colors disabled:opacity-50"
                                                    title="Approve"
                                                >
                                                    <Check className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => onStatusUpdate(booking.id, "Rejected")}
                                                    disabled={processing === booking.id}
                                                    className="p-1 rounded-md hover:bg-red-100 text-red-600 transition-colors disabled:opacity-50"
                                                    title="Reject"
                                                >
                                                    <X className="w-4 h-4" />
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
        </GlassCard>
    );
};
