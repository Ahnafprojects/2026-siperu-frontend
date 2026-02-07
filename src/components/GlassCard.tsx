import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "../lib/utils";

interface GlassCardProps extends HTMLMotionProps<"div"> {
    children: React.ReactNode;
    className?: string;
    gradient?: boolean;
}

export const GlassCard = ({ children, className, gradient = false, ...props }: GlassCardProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={cn(
                "glass-panel rounded-2xl p-6 relative overflow-hidden",
                gradient && "bg-gradient-to-br from-white/50 to-white/20",
                className
            )}
            {...props}
        >
            {gradient && (
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-50" />
            )}
            {children}
        </motion.div>
    );
};
