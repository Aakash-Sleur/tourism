'use client'

import { useState } from 'react'
import {
    CarIcon,
    UsersIcon,
    MapPinIcon,
    ClipboardListIcon,
    LogOutIcon,
    LayoutDashboardIcon,
    Hotel,
    UtensilsIcon,
    ChevronLeftIcon,
    ChevronRightIcon
} from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { motion, AnimatePresence } from 'framer-motion'

const sidebarItems = [
    { icon: LayoutDashboardIcon, label: 'Dashboard', href: '/admin' },
    { icon: UsersIcon, label: 'Users', href: '/admin/users' },
    { icon: MapPinIcon, label: 'Locations', href: '/admin/locations' },
    { icon: Hotel, label: 'Hotels', href: '/admin/hotels' },
    { icon: UtensilsIcon, label: 'Restaurants', href: '/admin/restaurants' },
]

export default function Sidebar() {
    const pathname = usePathname()
    const [isCollapsed, setIsCollapsed] = useState(false)
    const navigate = useRouter()

    return (
        <motion.aside
            initial={{ width: 256 }}
            animate={{ width: isCollapsed ? 80 : 256 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="bg-background border-r h-screen flex flex-col shadow-lg relative"
        >
            <div className="p-6 flex items-center justify-between">
                <AnimatePresence>
                    {!isCollapsed && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <Link href="/" className="flex items-center space-x-2">
                                <CarIcon className="h-6 w-6 text-primary" />
                                <span className="text-lg font-bold">ParkEase Admin</span>
                            </Link>
                        </motion.div>
                    )}
                </AnimatePresence>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                >
                    {isCollapsed ? <ChevronRightIcon className="h-4 w-4" /> : <ChevronLeftIcon className="h-4 w-4" />}
                </Button>
            </div>
            <ScrollArea className="flex-1">
                <nav className="px-4 py-2">
                    {sidebarItems.map((item, index) => (
                        <Link
                            key={item.label}
                            href={item.href}
                            className={`flex items-center space-x-3 px-3 py-2 rounded-md text-sm transition-all duration-200 ease-in-out mb-1
                                ${pathname === item.href
                                    ? 'bg-accent text-accent-foreground font-medium'
                                    : 'text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground'
                                }`}
                        >
                            <item.icon className="h-5 w-5" />
                            <AnimatePresence>
                                {!isCollapsed && (
                                    <motion.span
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -10 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        {item.label}
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </Link>
                    ))}
                </nav>
            </ScrollArea>
            <Separator />
            <div className="p-4">
                <Button variant="outline" onClick={() => navigate.push("/")} className="w-full justify-start space-x-2">
                    <LogOutIcon className="h-5 w-5" />
                    <AnimatePresence>
                        {!isCollapsed && (
                            <motion.span
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                transition={{ duration: 0.2 }}
                            >
                                Back to Home
                            </motion.span>
                        )}
                    </AnimatePresence>
                </Button>
            </div>
        </motion.aside>
    )
}