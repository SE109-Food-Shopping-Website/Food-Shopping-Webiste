"use client"; 
import { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface ClientLayoutProps {
    children: ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) { 
    const pathname = usePathname();
    return (
        <div className="w-full min-h-screen flex flex-col py-4">
            {/* Body */}
            <div className="flex-1 flex flex-col items-center text-left text-white font-inter">
                {/* Menu */}
                <nav className="fixed top-0 items-center space-x-4 p-1 w-full relative h-[50px] flex flex-row justify-between py-0 px-[100px] box-border gap-0 text-left text-[16px] font-bold font-inter justify-center px-4">
                    <Link
                        href="/client/history/unprepared"
                        className={`px-3 py-1 rounded-md ${
                            pathname === "/client/history/unprepared"
                                ? "bg-primary text-white font-bold"
                                : "text-black hover:bg-accent hover:text-white"
                        }`}
                    >
                        Chưa soạn
                    </Link>
                    <Link
                        href="/client/history/prepared"
                        className={`px-3 py-1 rounded-md ${
                            pathname === "/client/history/prepared"
                                ? "bg-primary text-white font-bold"
                                : "text-black hover:bg-accent hover:text-white"
                        }`}
                    >
                        Đã soạn
                    </Link>
                    <Link
                        href="/client/history/shipping"
                        className={`px-3 py-1 rounded-md ${
                            pathname === "/client/history/shipping"
                                ? "bg-primary text-white font-bold"
                                : "text-black hover:bg-accent hover:text-white"
                        }`}
                    >
                        Đang giao
                    </Link>
                    <Link
                        href="/client/history/completed"
                        className={`px-3 py-1 rounded-md ${
                            pathname === "/client/history/completed"
                                ? "bg-primary text-white font-bold"
                                : "text-black hover:bg-accent hover:text-white"
                        }`}
                    >
                        Đã giao
                    </Link>
                    <Link
                        href="/client/history/cancelled"
                        className={`px-3 py-1 rounded-md ${
                            pathname === "/client/history/cancelled"
                                ? "bg-primary text-white font-bold"
                                : "text-black hover:bg-accent hover:text-white"
                        }`}
                    >
                        Đã hủy
                    </Link>
                    <Link
                        href="/client/history/return"
                        className={`px-3 py-1 rounded-md ${
                            pathname === "/client/history/return"
                                ? "bg-primary text-white font-bold"
                                : "text-black hover:bg-accent hover:text-white"
                        }`}
                    >
                        Trả hàng
                    </Link>
                </nav>
                <main className="flex-1 flex flex-col items-center text-left text-white font-inter">
                    {children}
                </main>
            </div>
        </div>
    );
}