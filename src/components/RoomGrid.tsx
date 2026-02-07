import { Users, Wifi, Projector } from "lucide-react";
import { GlassCard } from "./GlassCard";
import type { Room } from "../types";

interface RoomGridProps {
    rooms: Room[];
}

export const RoomGrid = ({ rooms }: RoomGridProps) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 mb-12">
            {rooms.map((room) => (
                <GlassCard key={room.id} className="group hover:border-green-500/30 transition-colors" gradient>
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

                    <div className="flex gap-2 mt-4">
                        <div className="p-2 rounded-lg bg-gray-100" title="WiFi Available">
                            <Wifi className="w-4 h-4 text-gray-500" />
                        </div>
                        <div className="p-2 rounded-lg bg-gray-100" title="Projector Available">
                            <Projector className="w-4 h-4 text-gray-500" />
                        </div>
                    </div>
                </GlassCard>
            ))}
        </div>
    );
};
