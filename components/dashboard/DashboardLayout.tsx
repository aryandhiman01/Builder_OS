import { ReactNode } from "react";

import Sidebar from "./Sidebar";
import DashboardHeader from "./DashboardHeader";

interface DashboardLayoutProps {
    children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
    return (
        <div className="flex min-h-screen bg-[#050505] text-white">

            <Sidebar />

            {/* Right column */}
            <div className="flex min-h-screen flex-1 flex-col overflow-hidden">

                <DashboardHeader />

                <main className="flex-1 overflow-y-auto px-8 py-8">
                    {children}
                </main>

            </div>

        </div>
    );
}