'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog"
import { Calendar } from "@/components/ui/calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { format, addDays } from "date-fns"
import { Loader2 } from "lucide-react"
import { Label } from "@/components/ui/label"
import axios from 'axios'
import { useSession } from 'next-auth/react'
import { useToast } from '@/hooks/use-toast'

export default function TripBookingDialog({
    location,
    price,
    id
}: {
    location: string;
    price: number;
    id: string
}) {
    const [isOpen, setIsOpen] = useState(false)
    const [startDate, setStartDate] = useState<Date>()
    const [duration, setDuration] = useState<number>(1)
    const [isLoading, setIsLoading] = useState(false)
    const { data } = useSession()
    const { toast } = useToast()

    const handleDateSelect = (date: Date | undefined) => {
        setStartDate(date)
    }

    const handleDurationChange = (value: string) => {
        setDuration(parseInt(value, 10))
    }

    const calculateEndDate = () => {
        return startDate ? addDays(startDate, duration - 1) : undefined
    }

    const calculateTotalPrice = () => {
        return (price * duration).toFixed(2)
    }

    const handleBooking = async () => {
        if (!startDate) return
        setIsLoading(true)
        // Simulate API call
        try {
            await axios.post(`/api/location/${id}/reservation`, {
                userId: data?.user.id,
                start: startDate,
                end: calculateEndDate(),
                price: calculateTotalPrice()
            })
            toast({
                title: "Booking Confirmed",
                description: "Your trip has been booked successfully."

            })
            setIsLoading(false)
            setIsOpen(false)
        } catch (error) {
            console.error(error)
            toast({
                title: "Error",
                description: "An error occurred while booking your trip. Please try again later."
            })
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3 px-4 rounded text-lg">
                    Book Your Trip
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="text-2xl">Book Your Trip to {location} i</DialogTitle>
                </DialogHeader>
                <div className="grid gap-6 py-4">
                    <div className="flex flex-col space-y-4">
                        <div>
                            <Label htmlFor="start-date">Start Date</Label>
                            <Calendar
                                mode="single"
                                selected={startDate}
                                onSelect={handleDateSelect}
                                disabled={(date) => date < new Date()}
                                className="rounded-md border"
                            />
                        </div>
                        <div>
                            <Label htmlFor="duration">Duration (days)</Label>
                            <Select onValueChange={handleDurationChange} defaultValue="1">
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select duration" />
                                </SelectTrigger>
                                <SelectContent>
                                    {[1, 2, 3, 4, 5, 6, 7, 14, 21, 28].map((days) => (
                                        <SelectItem key={days} value={days.toString()}>
                                            {days} {days === 1 ? 'day' : 'days'}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    {startDate && (
                        <div className="bg-muted p-4 rounded-lg space-y-2">
                            <h3 className="font-semibold">Booking Summary</h3>
                            <p>Location: {location}</p>
                            <p>Start Date: {format(startDate, "MMM d, yyyy")}</p>
                            <p>End Date: {format(calculateEndDate()!, "MMM d, yyyy")}</p>
                            <p>Duration: {duration} {duration === 1 ? 'day' : 'days'}</p>
                            <p className="font-bold">Total Price: ${calculateTotalPrice()}</p>
                        </div>
                    )}
                </div>
                <DialogFooter>
                    <Button
                        onClick={handleBooking}
                        disabled={!startDate || isLoading}
                        className="w-full"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Processing
                            </>
                        ) : (
                            'Confirm Booking'
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}