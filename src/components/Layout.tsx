import type { ReactNode } from "react";
import { Navbar } from "./Navbar";

export const Layout = ({ children }: { children: ReactNode }) => {
    return (
        <div className="min-h-screen text-gray-100 font-sans selection:bg-purple-500/30">
            <Navbar />
            <div className="pt-28 pb-12 px-6 w-full max-w-[95%] mx-auto">
                {children}
            </div>

            {/* Background Ambient Glows */}
            {/* Simple Green Accent Background */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
                <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-green-100/50 rounded-bl-full blur-[100px]" />
                <div className="absolute bottom-0 left-0 w-[30%] h-[30%] bg-blue-100/50 rounded-tr-full blur-[80px]" />
            </div>
        </div>
    );
};
