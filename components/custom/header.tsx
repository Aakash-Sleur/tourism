"use client"

import { CarIcon, Globe2, LogOut } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { Button } from '../ui/button'
import { signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

const Header = () => {
    const { data, status } = useSession()
    const router = useRouter()

    const showSession = () => {
        if (status === "authenticated") {
            return (
                <Button
                    variant="ghost"
                    className="flex items-center space-x-2 hover:bg-destructive hover:text-destructive-foreground transition-colors"
                    onClick={() => signOut()}
                >
                    <LogOut className="h-4 w-4" />
                    <span>Sign Out</span>
                </Button>
            )
        } else if (status === "loading") {
            return (
                <span className="text-muted-foreground text-sm">Loading...</span>
            )
        } else {
            return (
                <div className="flex items-center space-x-2">
                    <Button variant="ghost" asChild>
                        <Link href="/signin">Sign In</Link>
                    </Button>
                    <Button asChild>
                        <Link href="/signup">Sign Up</Link>
                    </Button>
                </div>
            )
        }
    }

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center justify-between">
                <Link className="flex items-center space-x-2 text-primary" href="/">
                    <Globe2 className="h-6 w-6" />
                    <span className="text-xl font-bold">WanderLust</span>
                </Link>
                <nav className="flex items-center space-x-6">
                    <Link className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors" href="/">
                        Home
                    </Link>
                    <Link className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors" href="/explore">
                        Explore
                    </Link>
                    {
                        data?.user?.isAdmin && (
                            <Link className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors" href="/admin">
                                Admin
                            </Link>
                        )
                    }
                    {status === "authenticated" && (
                        <Link className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors" href="/profile">
                            My Profile
                        </Link>
                    )}
                    {showSession()}
                </nav>
            </div>
        </header>
    )
}

export default Header