import type { Metadata } from "next";
import localFont from "next/font/local";
import "../globals.css";
import SideBar from "@/components/custom/side-bar";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { AuthProvider } from "@/providers/session-provider";
import { authOptions } from "@/lib/auth";  // Assuming authOptions is defined in your project
import { Toaster } from "@/components/ui/toaster";

const geistSans = localFont({
    src: "../fonts/GeistVF.woff",
    variable: "--font-geist-sans",
    weight: "100 900",
});
const geistMono = localFont({
    src: "../fonts/GeistMonoVF.woff",
    variable: "--font-geist-mono",
    weight: "100 900",
});

export const metadata: Metadata = {
    title: "Admin Panel",
    description: "Only Admin is Allowed to access this panel",
};

export default async function AdminLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    // Fetch session server-side using getServerSession
    const session = await getServerSession(authOptions);
    console.log(session);

    if (!session || !session.user?.isAdmin) {
        redirect("/");
        return null;
    }

    return (
        <html>
            <AuthProvider>
                <body
                    className={`${geistSans.variable} ${geistMono.variable} antialiased`}
                >
                    <Toaster />
                    <div className="flex h-screen overflow-clip  bg-gray-100">
                        <SideBar />
                        {/* Main content */}
                        <main className="flex-1 p-8 overflow-auto mx-auto">
                            {children}
                        </main>
                    </div>
                </body>
            </AuthProvider>
        </html>
    );
}
