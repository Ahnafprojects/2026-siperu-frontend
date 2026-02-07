
import { Users, Clock, CheckCircle } from "lucide-react";
import { GlassCard } from "./GlassCard";

interface StatsProps {
    totalBookings: number;
    activeRooms: number;
}

export const StatsGrid = ({ totalBookings, activeRooms }: StatsProps) => {
    const stats = [
        {
            title: "Total Peminjaman",
            value: totalBookings,
            icon: Users,
            color: "text-blue-400",
            bg: "bg-blue-400/10",
        },
        {
            title: "Ruangan Aktif",
            value: activeRooms,
            icon: Clock,
            color: "text-purple-400",
            bg: "bg-purple-400/10",
        },
        {
            title: "Status Normal",
            value: "Online",
            icon: CheckCircle,
            color: "text-green-400",
            bg: "bg-green-400/10",
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {stats.map((stat, index) => (
                <GlassCard key={index} className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl ${stat.bg}`}>
                        <stat.icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">{stat.title}</p>
                        <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                    </div>
                </GlassCard>
            ))}
        </div>
    );
};
