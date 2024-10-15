'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { UserIcon, PhoneIcon, MailIcon, MapPinIcon } from "lucide-react"
import { useSession } from 'next-auth/react'
import axios from 'axios'

interface IUser {
    _id: string;
    email: string;
    username: string;
    image: string;
    bio: string;
    phone: string;
    address: string;
}

interface IReservation {
    _id: string;
    location: {
        _id: string;
        name: string;
    };
    start: string;
    end: string;
    price: number;
}

export default function Component() {
    const [user, setUser] = useState<IUser | null>(null)
    const [reservations, setReservations] = useState<IReservation[]>([])
    const [selectedReservation, setSelectedReservation] = useState<IReservation | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const { data: session } = useSession()

    useEffect(() => {
        const fetchData = async () => {
            if (session?.user?.id) {
                try {
                    const [userResponse, reservationsResponse] = await Promise.all([
                        axios.get(`/api/users/${session.user.id}`),
                        axios.get(`/api/users/${session.user.id}/reservation`)
                    ])
                    setUser(userResponse.data)
                    setReservations(reservationsResponse.data)
                } catch (err) {
                    setError('Failed to fetch user data')
                    console.error(err)
                } finally {
                    setLoading(false)
                }
            }
        }
        fetchData()
    }, [session])

    console.log(reservations)

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        })
    }

    const isReservationExpired = (endTime: string) => {
        return new Date(endTime) < new Date()
    }

    if (loading) return <div>Loading...</div>
    if (error) return <div>Error: {error}</div>
    if (!user) return <div>No user data available</div>

    return (
        <main className="flex-1">
            <section className="w-full py-12 md:py-24 lg:py-32">
                <div className="container px-4 md:px-6">
                    <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none mb-8">
                        My Profile
                    </h1>
                    <div className="grid gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>User Information</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex items-center space-x-2">
                                        <UserIcon className="h-5 w-5 text-muted-foreground" />
                                        <span>{user.username}</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <MailIcon className="h-5 w-5 text-muted-foreground" />
                                        <span>{user.email}</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <PhoneIcon className="h-5 w-5 text-muted-foreground" />
                                        <span>{user.phone}</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <MapPinIcon className="h-5 w-5 text-muted-foreground" />
                                        <span>{user.address || 'No address provided'}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle>My Reservations</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Location</TableHead>
                                            <TableHead>Start Time</TableHead>
                                            <TableHead>End Time</TableHead>
                                            <TableHead>Price</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {reservations.map((reservation) => (
                                            <TableRow key={reservation._id}>
                                                <TableCell>
                                                    <Dialog>
                                                        <DialogTrigger asChild>
                                                            <Button variant="link" onClick={() => setSelectedReservation(reservation)}>
                                                                {reservation.location.name}
                                                            </Button>
                                                        </DialogTrigger>
                                                        <DialogContent>
                                                            <DialogHeader>
                                                                <DialogTitle>Reservation Details</DialogTitle>
                                                            </DialogHeader>
                                                            {selectedReservation && (
                                                                <div className="space-y-4">
                                                                    <p><strong>Location:</strong> {selectedReservation.location.name}</p>
                                                                    <p><strong>Start Time:</strong> {formatDate(selectedReservation.start)}</p>
                                                                    <p><strong>End Time:</strong> {formatDate(selectedReservation.end)}</p>
                                                                    <p><strong>Price:</strong> ${selectedReservation.price.toFixed(2)}</p>
                                                                    <p><strong>Expired:</strong> {isReservationExpired(selectedReservation.end) ? 'Yes' : 'No'}</p>
                                                                </div>
                                                            )}
                                                        </DialogContent>
                                                    </Dialog>
                                                </TableCell>
                                                <TableCell>{formatDate(reservation.start)}</TableCell>
                                                <TableCell>{formatDate(reservation.end)}</TableCell>
                                                <TableCell>${reservation.price.toFixed(2)}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>
        </main>
    )
}