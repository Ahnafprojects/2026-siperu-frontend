import { useState } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { Room } from "../types";

interface BookingFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    rooms: Room[];
    onSuccess: () => void;
}

export const BookingFormModal = ({ isOpen, onClose, rooms, onSuccess }: BookingFormModalProps) => {
    const [formData, setFormData] = useState({
        studentName: "",
        purpose: "",
        roomId: rooms.length > 0 ? rooms[0].id : 0,
        startTime: "",
        endTime: "",
    });
    const [loading, setLoading] = useState(false);
    const API_URL = "http://localhost:5250/api/bookings";

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...formData, roomId: Number(formData.roomId) }),
            });
            if (!response.ok) throw new Error(await response.text());
            onSuccess();
            onClose();
            setFormData({ ...formData, studentName: "", purpose: "" });
        } catch (error) {
            alert("Error: " + error);
        } finally {
            setLoading(false);
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
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
                    >
                        <div className="w-full max-w-2xl bg-white rounded-2xl p-8 relative shadow-2xl border border-gray-100">
                            <button
                                onClick={onClose}
                                className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded-full"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            <div className="mb-8">
                                <h2 className="text-2xl font-bold text-gray-900">Form Peminjaman</h2>
                                <p className="text-gray-500 mt-1">Silakan lengkapi data di bawah ini untuk mengajukan peminjaman.</p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Name & Purpose Row */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="block text-sm font-semibold text-gray-700">Nama Mahasiswa</label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="Nama lengkap..."
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/10 transition-all outline-none bg-gray-50/50 focus:bg-white placeholder:text-gray-400"
                                            value={formData.studentName}
                                            onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-sm font-semibold text-gray-700">Keperluan</label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="Contoh: Rapat Himpunan"
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/10 transition-all outline-none bg-gray-50/50 focus:bg-white placeholder:text-gray-400"
                                            value={formData.purpose}
                                            onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                                        />
                                    </div>
                                </div>

                                {/* Room Selection */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-gray-700">Pilih Ruangan</label>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                        {rooms.map((room) => (
                                            <button
                                                key={room.id}
                                                type="button"
                                                onClick={() => setFormData({ ...formData, roomId: room.id })}
                                                className={`p-3 rounded-xl border text-sm font-medium transition-all duration-200 ${formData.roomId === room.id
                                                    ? "bg-green-600 text-white border-green-600 shadow-lg shadow-green-500/20 ring-2 ring-green-600 ring-offset-2"
                                                    : "bg-white text-gray-600 border-gray-200 hover:border-green-500 hover:text-green-600"
                                                    }`}
                                            >
                                                {room.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Date & Time Selection */}
                                <div className="p-5 rounded-2xl bg-gray-50 border border-gray-100 space-y-4">
                                    <label className="block text-sm font-semibold text-gray-700">Waktu Peminjaman</label>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Tanggal</label>
                                            <input
                                                type="date"
                                                required
                                                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:border-green-500 focus:ring-2 focus:ring-green-500/10 outline-none bg-white transition-all"
                                                onChange={(e) => {
                                                    const date = e.target.value;
                                                    const currentStart = formData.startTime.split("T")[1] || "09:00";
                                                    const currentEnd = formData.endTime.split("T")[1] || "11:00";
                                                    setFormData({
                                                        ...formData,
                                                        startTime: `${date}T${currentStart}`,
                                                        endTime: `${date}T${currentEnd}`
                                                    });
                                                }}
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Jam Mulai</label>
                                            <input
                                                type="time"
                                                required
                                                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:border-green-500 focus:ring-2 focus:ring-green-500/10 outline-none bg-white transition-all"
                                                value={formData.startTime.split("T")[1] || ""}
                                                onChange={(e) => {
                                                    const time = e.target.value;
                                                    const date = formData.startTime.split("T")[0] || new Date().toISOString().split("T")[0];
                                                    setFormData({ ...formData, startTime: `${date}T${time}` });
                                                }}
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Jam Selesai</label>
                                            <input
                                                type="time"
                                                required
                                                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:border-green-500 focus:ring-2 focus:ring-green-500/10 outline-none bg-white transition-all"
                                                value={formData.endTime.split("T")[1] || ""}
                                                onChange={(e) => {
                                                    const time = e.target.value;
                                                    const date = formData.endTime.split("T")[0] || new Date().toISOString().split("T")[0];
                                                    setFormData({ ...formData, endTime: `${date}T${time}` });
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-4 pt-4 border-t border-gray-100">
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="px-6 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors font-medium text-sm"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="flex-1 px-6 py-2.5 rounded-xl bg-green-600 text-white font-medium hover:bg-green-700 shadow-lg shadow-green-600/20 transition-all disabled:opacity-50 text-sm transform active:scale-[0.98]"
                                    >
                                        {loading ? "Menyimpan..." : "Ajukan Peminjaman"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
