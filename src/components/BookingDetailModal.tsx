import { X, Calendar, Clock, User, FileText, CheckCircle, XCircle, AlertCircle, Trash2, Ban } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Booking {
    id: number;
    studentName: string;
    purpose: string;
    room: { name: string };
    startTime: string;
    endTime: string;
    status: string;
}

interface BookingDetailModalProps {
    booking: Booking | null;
    isOpen: boolean;
    onClose: () => void;
    onStatusUpdate: (id: number, status: string) => void;
    onDelete: (id: number) => void;
    processing: boolean;
}

export const BookingDetailModal = ({ booking, isOpen, onClose, onStatusUpdate, onDelete, processing }: BookingDetailModalProps) => {
    if (!booking) return null;

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Approved': return 'text-green-600 bg-green-50 border-green-100';
            case 'Rejected': return 'text-red-600 bg-red-50 border-red-100';
            case 'Cancelled': return 'text-gray-600 bg-gray-50 border-gray-100';
            default: return 'text-yellow-600 bg-yellow-50 border-yellow-100';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'Approved': return <CheckCircle className="w-5 h-5" />;
            case 'Rejected': return <XCircle className="w-5 h-5" />;
            case 'Cancelled': return <Ban className="w-5 h-5" />;
            default: return <AlertCircle className="w-5 h-5" />;
        }
    };

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
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    >
                        <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100 flex flex-col max-h-[90vh]">
                            {/* Header */}
                            <div className="p-6 border-b border-gray-100 flex justify-between items-start bg-gray-50/50">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">Detail Peminjaman</h2>
                                    <p className="text-sm text-gray-500 mt-1">ID: #{booking.id}</p>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-2 rounded-full bg-white text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all border border-gray-200 shadow-sm"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="p-6 space-y-6 overflow-y-auto">
                                {/* Status Banner */}
                                <div className={`p-4 rounded-xl border flex items-center gap-3 ${getStatusColor(booking.status)}`}>
                                    {getStatusIcon(booking.status)}
                                    <div>
                                        <p className="font-semibold text-sm">Status: {booking.status}</p>
                                        {booking.status === 'Pending' && (
                                            <p className="text-xs opacity-80">Menunggu persetujuan admin</p>
                                        )}
                                    </div>
                                </div>

                                {/* Details Grid */}
                                <div className="grid grid-cols-1 gap-4">
                                    <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
                                        <User className="w-5 h-5 text-gray-400 mt-0.5" />
                                        <div>
                                            <p className="text-xs font-semibold text-gray-500 uppercase">Peminjam</p>
                                            <p className="font-medium text-gray-900">{booking.studentName}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
                                        <FileText className="w-5 h-5 text-gray-400 mt-0.5" />
                                        <div>
                                            <p className="text-xs font-semibold text-gray-500 uppercase">Keperluan</p>
                                            <p className="font-medium text-gray-900">{booking.purpose}</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
                                            <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                                            <div>
                                                <p className="text-xs font-semibold text-gray-500 uppercase">Tanggal</p>
                                                <p className="font-medium text-gray-900">{new Date(booking.startTime).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
                                            <Clock className="w-5 h-5 text-gray-400 mt-0.5" />
                                            <div>
                                                <p className="text-xs font-semibold text-gray-500 uppercase">Waktu</p>
                                                <p className="font-medium text-gray-900">
                                                    {new Date(booking.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -
                                                    {new Date(booking.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Footer Actions */}
                            <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex gap-3 justify-end">
                                {booking.status === 'Pending' ? (
                                    <>
                                        {/* Admin Actions */}
                                        <button
                                            onClick={() => onStatusUpdate(booking.id, 'Rejected')}
                                            disabled={processing}
                                            className="px-4 py-2 rounded-xl bg-red-100 text-red-700 font-medium hover:bg-red-200 transition-colors text-sm disabled:opacity-50"
                                        >
                                            Reject
                                        </button>
                                        <button
                                            onClick={() => onStatusUpdate(booking.id, 'Approved')}
                                            disabled={processing}
                                            className="px-4 py-2 rounded-xl bg-green-600 text-white font-medium hover:bg-green-700 transition-colors text-sm shadow-lg shadow-green-500/20 disabled:opacity-50"
                                        >
                                            Approve
                                        </button>

                                        {/* User Action: Cancel */}
                                        <button
                                            onClick={() => onStatusUpdate(booking.id, 'Cancelled')}
                                            disabled={processing}
                                            className="px-4 py-2 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-100 transition-colors text-sm disabled:opacity-50 ml-auto"
                                        >
                                            Cancel Booking
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        onClick={() => onDelete(booking.id)}
                                        disabled={processing}
                                        className="px-4 py-2 rounded-xl bg-gray-100 text-gray-600 font-medium hover:bg-gray-200 hover:text-red-600 transition-colors text-sm flex items-center gap-2 disabled:opacity-50"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        Hapus Riwayat
                                    </button>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
