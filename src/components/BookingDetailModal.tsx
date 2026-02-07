import { X, Check, XCircle, Trash2, Calendar, Clock, User, FileText, MapPin } from "lucide-react";
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
                        <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
                            {/* Header */}
                            <div className="relative h-24 bg-gradient-to-r from-green-500 to-emerald-600">
                                <button
                                    onClick={onClose}
                                    className="absolute top-4 right-4 p-1.5 rounded-full bg-black/10 text-white hover:bg-black/20 transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                                <div className="absolute -bottom-10 left-8">
                                    <div className="w-20 h-20 rounded-2xl bg-white shadow-lg p-1">
                                        <div className="w-full h-full rounded-xl bg-gray-50 flex items-center justify-center border border-gray-100">
                                            <span className="text-2xl font-bold text-gray-800">{booking.room.name.charAt(0)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Body */}
                            <div className="pt-12 px-8 pb-8">
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-900">{booking.studentName}</h2>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${booking.status === "Approved" ? "bg-green-100 text-green-700 border-green-200" :
                                                    booking.status === "Rejected" ? "bg-red-100 text-red-700 border-red-200" :
                                                        "bg-yellow-100 text-yellow-700 border-yellow-200"
                                                }`}>
                                                {booking.status}
                                            </span>
                                            <span className="text-xs text-gray-500">• ID: #{booking.id}</span>
                                        </div>
                                    </div>
                                    {booking.status !== "Approved" && (
                                        <button
                                            onClick={() => onDelete(booking.id)}
                                            className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
                                            title="Delete Booking"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    )}
                                </div>

                                <div className="space-y-4">
                                    <div className="flex gap-4">
                                        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                                            <MapPin className="w-5 h-5 text-blue-500" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Ruangan</p>
                                            <p className="font-medium text-gray-900">{booking.room.name}</p>
                                        </div>
                                    </div>

                                    <div className="flex gap-4">
                                        <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center shrink-0">
                                            <Calendar className="w-5 h-5 text-orange-500" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Waktu</p>
                                            <p className="font-medium text-gray-900">
                                                {new Date(booking.startTime).toLocaleDateString("id-ID", {
                                                    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
                                                })}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                {new Date(booking.startTime).toLocaleTimeString("id-ID", { hour: '2-digit', minute: '2-digit' })}
                                                {" - "}
                                                {new Date(booking.endTime).toLocaleTimeString("id-ID", { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex gap-4">
                                        <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center shrink-0">
                                            <FileText className="w-5 h-5 text-purple-500" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Keperluan</p>
                                            <p className="font-medium text-gray-900 leading-relaxed">
                                                {booking.purpose}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Actions */}
                                {booking.status === "Pending" && (
                                    <div className="flex gap-3 mt-8 pt-6 border-t border-gray-100">
                                        <button
                                            onClick={() => onStatusUpdate(booking.id, "Rejected")}
                                            disabled={processing}
                                            className="flex-1 py-2.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 font-medium transition-colors flex items-center justify-center gap-2"
                                        >
                                            <XCircle className="w-4 h-4" /> Tolak
                                        </button>
                                        <button
                                            onClick={() => onStatusUpdate(booking.id, "Approved")}
                                            disabled={processing}
                                            className="flex-1 py-2.5 rounded-xl bg-green-600 text-white hover:bg-green-700 font-medium transition-all shadow-lg shadow-green-600/20 flex items-center justify-center gap-2"
                                        >
                                            <Check className="w-4 h-4" /> Setujui
                                        </button>
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
